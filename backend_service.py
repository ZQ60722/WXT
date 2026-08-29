#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
后端服务管理脚本 - 将FastAPI挂载为后台服务
"""

import os
import sys
import subprocess
import time
import platform
import signal
import atexit

class BackendService:
    def __init__(self):
        self.project_root = os.path.dirname(os.path.abspath(__file__))
        self.backend_dir = os.path.join(self.project_root, "backend")
        self.pid_file = os.path.join(self.project_root, ".backend_pid")
        self.log_file = os.path.join(self.project_root, "backend_service.log")
        self.process = None
        
    def _get_python(self):
        """获取可用的Python解释器（优先使用虚拟环境，否则使用系统Python）"""
        venv_python = None
        if platform.system() == "Windows":
            venv_python = os.path.join(self.project_root, "venv", "Scripts", "python.exe")
        else:
            venv_python = os.path.join(self.project_root, "venv", "bin", "python")
        
        # 如果虚拟环境存在，使用虚拟环境
        if os.path.exists(venv_python):
            return venv_python
        
        # 否则使用系统Python
        return sys.executable
    
    def _check_port(self, port=8000):
        """检查端口是否被占用，如果被占用则终止占用进程"""
        import socket
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        result = sock.connect_ex(('127.0.0.1', port))
        sock.close()
        
        if result == 0:
            print(f"⚠️ 端口 {port} 已被占用，尝试终止占用进程...")
            if platform.system() == "Windows":
                # 查找占用端口的进程
                try:
                    output = subprocess.check_output(
                        f'netstat -aon | findstr ":{port}" | findstr "LISTENING"',
                        shell=True, text=True
                    )
                    # 提取PID
                    lines = output.strip().split('\n')
                    for line in lines:
                        parts = line.split()
                        if parts:
                            pid = parts[-1]
                            subprocess.run(f"taskkill /F /PID {pid}", shell=True, capture_output=True)
                            print(f"✅ 已终止进程 PID: {pid}")
                except subprocess.CalledProcessError:
                    pass
            else:
                # Linux/Mac: 使用 lsof 查找
                try:
                    output = subprocess.check_output(
                        f"lsof -ti :{port}",
                        shell=True, text=True
                    )
                    pids = output.strip().split('\n')
                    for pid in pids:
                        if pid:
                            os.kill(int(pid), signal.SIGTERM)
                            print(f"✅ 已终止进程 PID: {pid}")
                except subprocess.CalledProcessError:
                    pass
            time.sleep(1)
    
    def start(self):
        """启动后端服务"""
        print("🚀 正在启动后端服务...")
        
        # 检查是否已经在运行
        if self.is_running():
            print("⚠️ 后端服务已经在运行中")
            return
        
        # 检查并清理端口占用
        self._check_port(8000)
        
        python_path = self._get_python()
        print(f"使用 Python: {python_path}")
        
        os.chdir(self.backend_dir)
        
        # 启动命令
        cmd = [
            python_path,
            "-m", "uvicorn",
            "main:app",
            "--host", "127.0.0.1",
            "--port", "8000"
        ]
        
        if platform.system() == "Windows":
            # Windows: 在后台运行
            CREATE_NO_WINDOW = 0x08000000
            self.process = subprocess.Popen(
                cmd,
                stdout=open(self.log_file, 'a'),
                stderr=open(self.log_file, 'a'),
                creationflags=CREATE_NO_WINDOW,
                shell=True
            )
        else:
            # Mac/Linux: 使用 nohup
            self.process = subprocess.Popen(
                cmd,
                stdout=open(self.log_file, 'a'),
                stderr=open(self.log_file, 'a'),
                preexec_fn=os.setsid
            )
        
        # 保存PID
        with open(self.pid_file, 'w') as f:
            f.write(str(self.process.pid))
        
        time.sleep(2)
        print("✅ 后端服务已启动！")
        print(f"📍 进程ID: {self.process.pid}")
        print(f"📝 日志文件: {self.log_file}")
        print(f"🌐 访问地址: http://127.0.0.1:8000")
        print(f"📚 API文档: http://127.0.0.1:8000/api/docs")
    
    def stop(self):
        """停止后端服务"""
        print("🛑 正在停止后端服务...")
        
        if platform.system() == "Windows":
            # Windows: 根据PID杀死进程
            if os.path.exists(self.pid_file):
                with open(self.pid_file, 'r') as f:
                    pid = f.read().strip()
                if pid:
                    try:
                        subprocess.run(f"taskkill /F /PID {pid}", shell=True, capture_output=True)
                        print(f"✅ 已停止进程 (PID: {pid})")
                    except:
                        pass
                os.remove(self.pid_file)
            else:
                # 如果没有PID文件，杀死所有uvicorn
                subprocess.run("taskkill /F /IM python.exe /FI 'WINDOWTITLE eq uvicorn*'", shell=True)
        else:
            # Mac/Linux
            if os.path.exists(self.pid_file):
                with open(self.pid_file, 'r') as f:
                    pid = f.read().strip()
                if pid:
                    try:
                        os.kill(int(pid), signal.SIGTERM)
                        print(f"✅ 已停止进程 (PID: {pid})")
                    except:
                        pass
                os.remove(self.pid_file)
        
        print("✅ 后端服务已停止")
    
    def restart(self):
        """重启后端服务"""
        print("🔄 正在重启后端服务...")
        self.stop()
        time.sleep(2)
        self.start()
    
    def status(self):
        """查看服务状态"""
        if self.is_running():
            if os.path.exists(self.pid_file):
                with open(self.pid_file, 'r') as f:
                    pid = f.read().strip()
                print(f"✅ 后端服务运行中 (PID: {pid})")
                print(f"🌐 访问地址: http://127.0.0.1:8000")
            else:
                print("✅ 后端服务运行中")
        else:
            print("❌ 后端服务未运行")
    
    def logs(self, lines=20):
        """查看日志"""
        if os.path.exists(self.log_file):
            with open(self.log_file, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.readlines()
                for line in content[-lines:]:
                    print(line.strip())
        else:
            print("📝 暂无日志")
    
    def is_running(self):
        """检查服务是否运行"""
        if not os.path.exists(self.pid_file):
            return False
        
        try:
            with open(self.pid_file, 'r') as f:
                pid = f.read().strip()
            if not pid:
                return False
            
            if platform.system() == "Windows":
                result = subprocess.run(f"tasklist /FI 'PID eq {pid}'", 
                                      capture_output=True, text=True, shell=True)
                return "python.exe" in result.stdout
            else:
                os.kill(int(pid), 0)
                return True
        except:
            return False

def print_help():
    """显示帮助信息"""
    print("""
╔═══════════════════════════════════════════════════╗
║          后端服务管理工具                         ║
╠═══════════════════════════════════════════════════╣
║  python backend_service.py start   启动服务      ║
║  python backend_service.py stop    停止服务      ║
║  python backend_service.py restart 重启服务      ║
║  python backend_service.py status  查看状态      ║
║  python backend_service.py logs    查看日志      ║
╚═══════════════════════════════════════════════════╝
    """)

def main():
    service = BackendService()
    
    if len(sys.argv) < 2:
        print_help()
        return
    
    command = sys.argv[1]
    
    if command == "start":
        service.start()
    elif command == "stop":
        service.stop()
    elif command == "restart":
        service.restart()
    elif command == "status":
        service.status()
    elif command == "logs":
        lines = int(sys.argv[2]) if len(sys.argv) > 2 else 20
        service.logs(lines)
    else:
        print(f"❌ 未知命令: {command}")
        print_help()

if __name__ == "__main__":
    main()