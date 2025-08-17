#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
영상 파일에서 오디오를 추출하고 Whisper 로 자막(SRT) 파일을 만든다.
사용법:
    python video_to_subtitle.py -i input_video.mp4 -o output.srt --model medium
옵션:
    -i, --input      입력 영상 파일 (필수)
    -o, --output     출력 자막 파일 (기본: 입력파일명.srt)
    --model          Whisper 모델 size (tiny, base, small, medium, large)
    --language       언어 코드 (예: ko, en, ja). 지정하지 않으면 자동 감지
    --device         'cpu' 혹은 'cuda' (GPU 사용 시)
    --batch_size     한 번에 처리할 오디오 청크 수 (faster-whisper 전용)
"""

import argparse
import os
import subprocess
import sys
import tempfile

# -------------------------------------------------
# 1) ffmpeg 로 영상 → wav (16kHz, mono) 변환
# -------------------------------------------------
def extract_audio(video_path: str, target_wav: str) -> None:
    """
    ffmpeg 를 이용해 영상 파일에서 16kHz, mono wav 로 변환한다.
    """
    cmd = [
        "ffmpeg",
        "-y",                     # 기존 파일 덮어쓰기
        "-i", video_path,
        "-ac", "1",               # mono
        "-ar", "16000",           # 16 kHz (Whisper 권장)
        "-vn",                    # 비디오 스트림 무시
        target_wav,
    ]
    try:
        subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.STDOUT)
    except subprocess.CalledProcessError as e:
        print(f"[ERROR] ffmpeg 실행 실패: {e}")
        sys.exit(1)

# -------------------------------------------------
# 2) Whisper 로 자막 생성
# -------------------------------------------------
def transcribe_whisper(
    audio_path: str,
    model_name: str = "base",
    language: str = None,
    device: str = "cpu",
    batch_size: int = 16,
):
    """
    Whisper (openai/whisper) 혹은 faster-whisper 로 음성을 텍스트와 타임스탬프를 반환한다.
    반환값: List[dict] - 각 dict 은 { "start": sec, "end": sec, "text": str }
    """
    # ----- 2-1) faster-whisper 우선 시도 -----
    try:
        from faster_whisper import WhisperModel

        print("[INFO] faster-whisper 로 로드 중...")
        model = WhisperModel(model_name, device=device, compute_type="int8")
        segments, _ = model.transcribe(
            audio_path,
            language=language,
            beam_size=5,
            best_of=5,
            patience=1.0,
            word_timestamps=False,
            vad_filter=True,
            vad_parameters=dict(min_silence_duration_ms=200),
            condition_on_previous_text=False,
        )
        result = []
        for seg in segments:
            result.append(
                {"start": seg.start, "end": seg.end, "text": seg.text.strip()}
            )
        return result

    except ImportError:
        # ----- 2-2) openai/whisper fallback -----
        print("[INFO] faster-whisper 가 없으니 openai/whisper 로 전환합니다...")
        import whisper

        model = whisper.load_model(model_name, device=device)
        # Whisper 에서는 전체 오디오를 한 번에 decode 하므로 옵션을 맞추어 줍니다.
        options = dict(
            language=language,
            word_timestamps=False,
            fp16=device != "cpu",
        )
        result = model.transcribe(audio_path, **options)
        # result["segments"] 에는 start, end, text 가 들어있음
        return [
            {"start": seg["start"], "end": seg["end"], "text": seg["text"].strip()}
            for seg in result["segments"]
        ]


# -------------------------------------------------
# 3) SRT 파일 저장
# -------------------------------------------------
def format_timestamp(seconds: float) -> str:
    """00:00:00,000 형태로 변환"""
    hrs = int(seconds // 3600)
    mins = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = int(round((seconds - int(seconds)) * 1000))
    return f"{hrs:02d}:{mins:02d}:{secs:02d},{millis:03d}"


def write_srt(transcript, output_path: str) -> None:
    """transcript(list) → .srt 파일"""
    with open(output_path, "w", encoding="utf-8") as f:
        for i, seg in enumerate(transcript, start=1):
            f.write(f"{i}\n")
            f.write(f"{format_timestamp(seg['start'])} --> {format_timestamp(seg['end'])}\n")
            f.write(f"{seg['text']}\n\n")


# -------------------------------------------------
# 4) 메인 로직
# -------------------------------------------------
def main():
    parser = argparse.ArgumentParser(description="Video → Whisper subtitles (SRT)")
    parser.add_argument("-i", "--input", required=True, help="입력 영상 파일 경로")
    parser.add_argument("-o", "--output", help="출력 SRT 파일 경로 (기본: INPUT.srt)")
    parser.add_argument("--model", default="base", choices=["tiny","base","small","medium","large"], help="Whisper model size")
    parser.add_argument("--language", help="언어 코드 (예: ko, en, ja). 지정하지 않으면 자동 감지")
    parser.add_argument("--device", default="cpu", choices=["cpu", "cuda"], help="실행 디바이스")
    parser.add_argument("--batch_size", type=int, default=16, help="[faster-whisper 전용] 배치 사이즈")
    args = parser.parse_args()

    video_path = args.input
    if not os.path.isfile(video_path):
        print(f"[ERROR] 파일이 존재하지 않음: {video_path}")
        sys.exit(1)

    # 출력 파일명 자동 지정
    output_srt = args.output or os.path.splitext(video_path)[0] + ".srt"

    # 임시 wav 파일 생성
    with tempfile.TemporaryDirectory() as tmpdir:
        wav_path = os.path.join(tmpdir, "audio.wav")
        print("[INFO] 영상에서 오디오 추출 중...")
        extract_audio(video_path, wav_path)

        print("[INFO] Whisper 로 트랜스크립션 수행 중...")
        transcript = transcribe_whisper(
            wav_path,
            model_name=args.model,
            language=args.language,
            device=args.device,
            batch_size=args.batch_size,
        )

        print(f"[INFO] SRT 파일 저장: {output_srt}")
        write_srt(transcript, output_srt)

    print("[DONE] 작업이 성공적으로 완료되었습니다!")


if __name__ == "__main__":
    main()
