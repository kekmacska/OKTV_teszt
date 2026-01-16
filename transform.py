import json

input_file = "questions/2025.json"
output_file = "2025_converted.json"

with open(input_file, "r", encoding="utf-8") as f:
    data = json.load(f)

converted = []

for block in data:
    for key, value in block.items():
        if key.isdigit():
            value["id"] = int(key)
            converted.append(value)

with open(output_file, "w", encoding="utf-8") as f:
    json.dump(converted, f, ensure_ascii=False, indent=2)

print("Conversion done →", output_file)
