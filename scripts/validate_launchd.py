import os
import plistlib
import subprocess
import shutil
import stat

directories = [
    os.path.expanduser("~/Library/LaunchAgents"),
    "/Library/LaunchAgents",
    "/Library/LaunchDaemons"
]

def get_loaded_labels():
    try:
        output = subprocess.check_output(["launchctl", "list"], text=True)
        labels = {}
        for line in output.strip().split("\n")[1:]:
            parts = line.split("\t")
            if len(parts) >= 3:
                pid, last_exit, label = parts[0], parts[1], parts[2]
                labels[label] = {"pid": pid, "last_exit": last_exit}
        return labels
    except Exception as e:
        print(f"Error getting loaded launchctl labels: {e}")
        return {}

def check_executable(path, is_daemon):
    if not path:
        return "N/A"
    path = os.path.expanduser(path)
    if not os.path.exists(path):
        return "Missing Exec"
    
    try:
        mode = os.stat(path).st_mode
        # If it's a daemon (running as root), it needs at least owner execute bit set.
        # Otherwise, check if any execution bit is set
        is_exec = False
        if is_daemon:
            is_exec = bool(mode & stat.S_IXUSR)
        else:
            is_exec = bool(mode & (stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH))
        
        return "Valid" if is_exec else "Not Executable"
    except Exception:
        return "Permission Error"

def validate_plists():
    loaded_jobs = get_loaded_labels()
    
    print(f"{'Directory / Plist File':<60} | {'Label':<35} | {'Loaded?':<8} | {'PID':<6} | {'Exit':<6} | {'Exec Status':<12}")
    print("-" * 140)
    
    for directory in directories:
        if not os.path.exists(directory):
            continue
        
        is_daemon = "LaunchDaemons" in directory
        
        for filename in sorted(os.listdir(directory)):
            if not filename.endswith(".plist"):
                continue
            
            filepath = os.path.join(directory, filename)
            rel_path = os.path.join(os.path.basename(directory), filename)
            
            label = "Unknown"
            exec_status = "N/A"
            loaded = "No"
            pid = "-"
            last_exit = "-"
            
            try:
                with open(filepath, 'rb') as f:
                    data = plistlib.load(f)
                
                # Check for empty plist
                if not data:
                    label = "Empty Plist"
                    exec_status = "Empty"
                    print(f"{rel_path:<60} | {label:<35} | {loaded:<8} | {pid:<6} | {last_exit:<6} | {exec_status:<12}")
                    continue
                
                label = data.get("Label", "MISSING LABEL")
                
                # Find executable
                program = data.get("Program")
                args = data.get("ProgramArguments", [])
                
                exec_path = None
                if program:
                    exec_path = program
                elif args and len(args) > 0:
                    exec_path = args[0]
                
                if exec_path:
                    resolved_exec = shutil.which(exec_path) or os.path.expanduser(exec_path)
                    exec_status = check_executable(resolved_exec, is_daemon)
                else:
                    exec_status = "No Program Key"
                
                # Check if loaded
                if label in loaded_jobs:
                    loaded = "Yes"
                    pid = loaded_jobs[label]["pid"]
                    last_exit = loaded_jobs[label]["last_exit"]
                    
            except Exception as e:
                label = "Parse Error"
                exec_status = "N/A"
                print(f"{rel_path:<60} | {label:<35} | {'N/A':<8} | {'-':<6} | {'-':<6} | {str(e):<12}")
                continue
                
            print(f"{rel_path:<60} | {label:<35} | {loaded:<8} | {pid:<6} | {last_exit:<6} | {exec_status:<12}")

if __name__ == "__main__":
    validate_plists()
