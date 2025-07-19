from transformers import AutoModelForCausalLM, AutoTokenizer, TextStreamer

# pip install git+https://github.com/lgai-exaone/transformers@add-exaone4

model_name = "LGAI-EXAONE/EXAONE-4.0-1.2B"
# model_name = "LGAI-EXAONE/EXAONE-4.0-32B"

# File paths
SYSTEM_PROMPT_FILE = "system.prompt"
PROMPT_FILE = "prompt.txt"
RESULT_FILE = "result.txt"

model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype="bfloat16",
    device_map="auto"
)
tokenizer = AutoTokenizer.from_pretrained(model_name)

with open(PROMPT_FILE, "r", encoding="utf-8") as f:
    prompt = f.read()

with open(SYSTEM_PROMPT_FILE, "r", encoding="utf-8") as f:
    system_prompt = f.read()

messages = [
    {"role":"system","content": system_prompt},
    {"role": "user", "content": prompt}
]
input_ids = tokenizer.apply_chat_template(
    messages,
    tokenize=True,
    add_generation_prompt=True,
    return_tensors="pt"
)

streamer = TextStreamer(tokenizer, skip_prompt=True)

output = model.generate(
    input_ids.to(model.device),
    max_new_tokens=11024,
    do_sample=False,
    streamer=streamer,
)
# The streamer prints the generated text to the console.
# The `output` tensor contains the full sequence, including the prompt.
# We need to decode only the generated part for the output file.
generated_ids = output[0][input_ids.shape[1]:]
result = tokenizer.decode(generated_ids, skip_special_tokens=True)

with open(RESULT_FILE, "w", encoding="utf-8") as f:
    f.write(result)