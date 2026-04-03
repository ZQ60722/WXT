"""
增城荔枝文化遗产数据库初始化脚本
从Excel文件导入数据到SQLite数据库
"""
import pandas as pd
import os
import sys

# 添加当前目录到系统路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import init_db, SessionLocal, Terminology, ZengchengLychee, AncientPoetry, AcademicPaper


def import_terminology_data(db):
    """
    导入术语数据 - 中国荔枝品种汇总表
    列：中文、英文、文化内涵、文化内涵英文翻译
    """
    excel_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'db', '荔枝.xlsx')
    
    print("\n" + "=" * 60)
    print("导入术语数据 - 中国荔枝品种汇总")
    print("=" * 60)
    
    try:
        # 读取第二个sheet（中国荔枝品种汇总）
        df = pd.read_excel(excel_path, sheet_name='中国荔枝品种汇总')
        print(f"读取到 {len(df)} 行数据")
        print(f"列名: {df.columns.tolist()}")
        
        # 清空现有数据
        db.query(Terminology).delete()
        print("已清空现有术语数据")
        
        # 导入新数据
        count = 0
        for idx, row in df.iterrows():
            try:
                chinese = str(row.iloc[0]).strip() if pd.notna(row.iloc[0]) else ""
                english = str(row.iloc[1]).strip() if pd.notna(row.iloc[1]) else ""
                cultural = str(row.iloc[2]).strip() if pd.notna(row.iloc[2]) else None
                cultural_en = str(row.iloc[3]).strip() if pd.notna(row.iloc[3]) else None
                
                # 跳过空行
                if not chinese:
                    continue
                
                # 创建术语记录
                term = Terminology(
                    chinese_term=chinese,
                    english_term=english,
                    cultural_connotation=cultural,
                    cultural_connotation_en=cultural_en,
                    category="荔枝品种"
                )
                db.add(term)
                count += 1
                
                # 每10条提交一次
                if count % 10 == 0:
                    db.commit()
                    print(f"已导入 {count} 条术语...")
                
            except Exception as e:
                print(f"导入第 {idx+1} 行时出错: {e}")
                continue
        
        # 最终提交
        db.commit()
        print(f"\n✓ 成功导入 {count} 条术语数据!")
        return True
        
    except Exception as e:
        db.rollback()
        print(f"✗ 导入术语数据失败: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def import_zengcheng_data(db):
    """
    导入增城荔枝数据 - 增城荔枝细化表
    列：中文、英文、描述、描述英文
    """
    excel_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'db', '荔枝.xlsx')
    
    print("\n" + "=" * 60)
    print("导入增城荔枝数据 - 增城荔枝细化")
    print("=" * 60)
    
    try:
        # 读取第一个sheet（增城荔枝细化）
        df = pd.read_excel(excel_path, sheet_name='增城荔枝细化')
        print(f"读取到 {len(df)} 行数据")
        print(f"列名: {df.columns.tolist()}")
        
        # 清空现有数据
        db.query(ZengchengLychee).delete()
        print("已清空现有增城数据")
        
        # 导入新数据
        count = 0
        for idx, row in df.iterrows():
            try:
                chinese = str(row.iloc[0]).strip() if pd.notna(row.iloc[0]) else ""
                english = str(row.iloc[1]).strip() if pd.notna(row.iloc[1]) else ""
                description = str(row.iloc[2]).strip() if pd.notna(row.iloc[2]) else None
                description_en = str(row.iloc[3]).strip() if pd.notna(row.iloc[3]) else None
                
                # 跳过空行
                if not chinese:
                    continue
                
                # 创建记录
                item = ZengchengLychee(
                    chinese_name=chinese,
                    english_name=english,
                    description=description,
                    description_en=description_en,
                    category="增城特产"
                )
                db.add(item)
                count += 1
                
                # 每5条提交一次
                if count % 5 == 0:
                    db.commit()
                    print(f"已导入 {count} 条数据...")
                
            except Exception as e:
                print(f"导入第 {idx+1} 行时出错: {e}")
                continue
        
        # 最终提交
        db.commit()
        print(f"\n✓ 成功导入 {count} 条增城荔枝数据!")
        return True
        
    except Exception as e:
        db.rollback()
        print(f"✗ 导入增城数据失败: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def import_poetry_data(db):
    """
    导入古诗词数据 - 荔枝古诗词表
    列：诗句、作者、诗名、诗句英文翻译（大模型）
    按用户要求的顺序：诗句、诗句英文、诗名、作者
    """
    excel_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'db', '荔枝.xlsx')
    
    print("\n" + "=" * 60)
    print("导入古诗词数据 - 荔枝古诗词")
    print("=" * 60)
    
    try:
        # 读取第三个sheet（荔枝古诗词）
        df = pd.read_excel(excel_path, sheet_name='荔枝古诗词')
        print(f"读取到 {len(df)} 行数据")
        print(f"列名: {df.columns.tolist()}")
        
        # 清空现有数据
        db.query(AncientPoetry).delete()
        print("已清空现有诗词数据")
        
        # 导入新数据
        count = 0
        for idx, row in df.iterrows():
            try:
                # 按实际列顺序读取
                poem_content = str(row.iloc[0]).strip() if pd.notna(row.iloc[0]) else ""
                author = str(row.iloc[1]).strip() if pd.notna(row.iloc[1]) else None
                poem_title = str(row.iloc[2]).strip() if pd.notna(row.iloc[2]) else None
                poem_content_en = str(row.iloc[3]).strip() if pd.notna(row.iloc[3]) else None
                
                # 跳过空行
                if not poem_content:
                    continue
                
                # 创建记录
                poetry = AncientPoetry(
                    poem_content=poem_content,
                    poem_content_en=poem_content_en,
                    poem_title=poem_title,
                    author=author,
                    dynasty=None  # 可以在数据中解析或后续补充
                )
                db.add(poetry)
                count += 1
                
                # 每10条提交一次
                if count % 10 == 0:
                    db.commit()
                    print(f"已导入 {count} 条诗词...")
                
            except Exception as e:
                print(f"导入第 {idx+1} 行时出错: {e}")
                continue
        
        # 最终提交
        db.commit()
        print(f"\n✓ 成功导入 {count} 条古诗词数据!")
        return True
        
    except Exception as e:
        db.rollback()
        print(f"✗ 导入诗词数据失败: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def import_academic_papers(db):
    """
    导入学术文献数据 - 知网文献研究爬取表
    列：篇名、篇名英文翻译、作者、刊名、刊名英文翻译
    """
    excel_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'db', '荔枝.xlsx')
    
    print("\n" + "=" * 60)
    print("导入学术文献数据 - 知网文献研究爬取")
    print("=" * 60)
    
    try:
        # 读取第四个sheet（知网文献研究爬取）
        df = pd.read_excel(excel_path, sheet_name='知网文献研究爬取')
        print(f"读取到 {len(df)} 行数据")
        print(f"列名: {df.columns.tolist()}")
        
        # 清空现有数据
        db.query(AcademicPaper).delete()
        print("已清空现有文献数据")
        
        # 导入新数据
        count = 0
        for idx, row in df.iterrows():
            try:
                title = str(row.iloc[0]).strip() if pd.notna(row.iloc[0]) else ""
                title_en = str(row.iloc[1]).strip() if pd.notna(row.iloc[1]) else None
                author = str(row.iloc[2]).strip() if pd.notna(row.iloc[2]) else None
                journal = str(row.iloc[3]).strip() if pd.notna(row.iloc[3]) else None
                journal_en = str(row.iloc[4]).strip() if pd.notna(row.iloc[4]) else None
                
                # 跳过空行
                if not title:
                    continue
                
                # 创建记录
                paper = AcademicPaper(
                    title=title,
                    title_en=title_en,
                    author=author,
                    journal=journal,
                    journal_en=journal_en
                )
                db.add(paper)
                count += 1
                
                # 每10条提交一次
                if count % 10 == 0:
                    db.commit()
                    print(f"已导入 {count} 条文献...")
                
            except Exception as e:
                print(f"导入第 {idx+1} 行时出错: {e}")
                continue
        
        # 最终提交
        db.commit()
        print(f"\n✓ 成功导入 {count} 条学术文献数据!")
        return True
        
    except Exception as e:
        db.rollback()
        print(f"✗ 导入文献数据失败: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def main():
    """
    主函数：初始化数据库并导入所有数据
    """
    print("=" * 60)
    print("增城荔枝文化遗产数据库初始化")
    print("=" * 60)
    
    # 第一步：创建数据库表
    print("\n【第一步】创建数据库表...")
    init_db()
    
    # 第二步：导入数据
    print("\n【第二步】导入Excel数据...")
    
    db = SessionLocal()
    try:
        # 导入术语数据
        import_terminology_data(db)
        
        # 导入增城数据
        import_zengcheng_data(db)
        
        # 导入古诗词数据
        import_poetry_data(db)
        
        # 导入学术文献数据
        import_academic_papers(db)
        
        print("\n" + "=" * 60)
        print("数据库初始化完成!")
        print("=" * 60)
        
        # 显示统计信息
        print("\n数据统计:")
        print(f"  - 术语数据: {db.query(Terminology).count()} 条")
        print(f"  - 增城荔枝: {db.query(ZengchengLychee).count()} 条")
        print(f"  - 古诗词: {db.query(AncientPoetry).count()} 条")
        print(f"  - 学术文献: {db.query(AcademicPaper).count()} 条")
        
    except Exception as e:
        print(f"\n✗ 初始化过程中出错: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()


if __name__ == "__main__":
    main()
