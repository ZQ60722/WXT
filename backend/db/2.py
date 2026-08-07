"""
岭南农遗专属词汇收集器
模型：Qwen/Qwen3-8B（极速、无思考过程、免费）
输出：CSV表格（简单词汇表）
"""

import json
import time
import re
import csv
from openai import OpenAI

# ==================== 你的API配置 ====================
import os
api_key = os.environ.get("SILICONFLOW_API_KEY", "")
api_url = "https://api.siliconflow.cn/v1"
model = "Qwen/Qwen3-8B"
# =====================================================

OUTPUT_CSV = "C:\\Users\\AUG76\\Desktop\\岭南农遗专属词汇表.csv"

# ==================== 可调整参数 ====================
# 每个农遗项目生成多少条词汇，改下面的数字
# 6个项目，每个80-90条，总计约500条
VOCAB_COUNTS = [85, 82, 88, 80, 83, 86]  # 总计504条
# =====================================================

# 6个岭南农遗项目
HERITAGE_ITEMS = [
    {
        "类型": "桑基鱼塘",
        "地点": "广东佛山顺德",
        "背景": "珠三角地区传统的生态农业模式，塘基种桑、桑叶养蚕、蚕沙喂鱼、塘泥肥桑"
    },
    {
        "类型": "增城荔枝",
        "地点": "广东广州增城",
        "背景": "增城挂绿荔枝闻名天下，有2000多年栽培历史，是贡品级名果"
    },
    {
        "类型": "化橘红",
        "地点": "广东茂名化州",
        "背景": "化州特产，以礞石土壤孕育的橘红药效独特，是岭南地道药材"
    },
    {
        "类型": "莞香",
        "地点": "广东东莞",
        "背景": "东莞种植沉香树、制作沉香的历史悠久，是海上丝绸之路的重要香料"
    },
    {
        "类型": "新会陈皮",
        "地点": "广东江门新会",
        "背景": "新会茶枝柑皮制作，越陈越香，是岭南三宝之首，药食同源"
    },
    {
        "类型": "凤凰单丛茶",
        "地点": "广东潮州凤凰山",
        "背景": "乌龙茶极品，一树一香，宋种古茶树有700多年历史"
    }
]


def build_prompt(heritage, count):
    """生成词汇表的prompt"""
    return f"""你是一位农遗词汇专家，正在整理{heritage['类型']}相关的专属词汇。

【农遗项目】{heritage['类型']}
【地点】{heritage['地点']}
【背景知识】{heritage['背景']}

请你生成{count}个{heritage['类型']}相关的专属词汇。

词汇类型包括：
1. 品种/品类名称（不同等级、不同种类的叫法）
2. 部位/结构名称（植物部位、产品部位等）
3. 工艺/工序名称（制作过程中的各个环节）
4. 农具/器具名称（使用的工具、设备）
5. 环境/场地名称（种植环境、加工场所等）
6. 品质/特征描述词（形容好坏的专业词汇）
7. 时令/节气相关词（与农时相关的术语）
8. 传统计量/交易用语（斤两、等级、行话等）

要求：
1. 词汇必须是该农遗项目特有的或常用的
2. 可以是两个字、三个字或四个字的词
3. 涵盖不同维度的词汇，不要太单一
4. 每个词汇都要有准确的英文翻译

请严格按以下JSON格式输出，不要输出任何其他内容：
{{
  "vocabs": [
    {{
      "词汇": "中文词汇",
      "翻译": "English translation"
    }},
    ...
  ]
}}"""


def generate_vocabs(client, heritage, count):
    """生成词汇数据"""
    prompt = build_prompt(heritage, count)
    
    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": "你是一位农遗词汇专家，擅长整理农业文化遗产相关的专业词汇。只输出JSON，不要输出任何其他文字。"},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )
        raw = response.choices[0].message.content
        
        # ---- 兼容性JSON解析 ----
        clean = re.sub(r"```json\s*|```", "", raw).strip()
        match = re.search(r"\{[\s\S]*\}", clean)
        json_str = match.group(0) if match else clean
        
        result = json.loads(json_str)
        vocabs_list = result.get("vocabs", [])
        
        valid = []
        for item in vocabs_list:
            if isinstance(item, dict) and "词汇" in item:
                valid.append({
                    "词汇": item.get("词汇", ""),
                    "翻译": item.get("翻译", "")
                })
        return valid
        
    except json.JSONDecodeError as e:
        print(f"  ❌ JSON解析失败: {e}")
        print(f"  原始输出: {raw[:300]}")
        return []
    except Exception as e:
        print(f"  ❌ 请求出错: {e}")
        return []


def save_to_csv(results, filename):
    """保存为带BOM的CSV（Excel直接双击打开不会乱码）"""
    from datetime import datetime
    
    fieldnames = ["类型", "词汇", "翻译"]
    
    # 如果文件被占用，尝试用临时文件名保存
    try:
        with open(filename, "w", newline="", encoding="utf-8-sig") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(results)
        print(f"  💾 已保存: {filename}")
    except PermissionError:
        timestamp = datetime.now().strftime("%H%M%S")
        alt_filename = filename.replace(".csv", f"_{timestamp}.csv")
        with open(alt_filename, "w", newline="", encoding="utf-8-sig") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(results)
        print(f"  💾 原文件被占用，已保存到: {alt_filename}")


def main():
    print("=" * 60)
    print("  岭南农遗专属词汇收集")
    print(f"  模型: {model}")
    print(f"  农遗项目: {len(HERITAGE_ITEMS)} 个")
    print(f"  预计总数: {sum(VOCAB_COUNTS)} 条")
    print("=" * 60)

    client = OpenAI(api_key=api_key, base_url=api_url)

    all_results = []
    fail_count = 0
    start_time = time.time()

    for i, heritage in enumerate(HERITAGE_ITEMS, 1):
        count = VOCAB_COUNTS[i-1]
        print(f"\n[{i}/{len(HERITAGE_ITEMS)}] 正在生成 {heritage['类型']} 的词汇 ({count}条)...")

        vocabs = generate_vocabs(client, heritage, count)

        if vocabs:
            # 直接组装数据，不需要额外翻译
            data = []
            for item in vocabs:
                data.append({
                    "类型": heritage["类型"],
                    "词汇": item["词汇"],
                    "翻译": item["翻译"]
                })
            all_results.extend(data)
            print(f"  -> 完成 {len(data)}条")
        else:
            fail_count += 1
            print(f"  -> 失败")

        # 每完成一个项目自动保存一次
        save_to_csv(all_results, OUTPUT_CSV)
        time.sleep(0.5)

    # 最终保存
    save_to_csv(all_results, OUTPUT_CSV)

    cost = time.time() - start_time
    print(f"\n{'='*60}")
    print(f"  全部完成！")
    print(f"  耗时: {cost:.0f}秒 ({cost/60:.1f}分钟)")
    print(f"  成功: {len(HERITAGE_ITEMS) - fail_count}个 / 失败: {fail_count}个")
    print(f"  总条数: {len(all_results)} 条")
    print(f"  文件: {OUTPUT_CSV}")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
