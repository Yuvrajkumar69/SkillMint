import getpass
import os
import subprocess
import sys

MYSQL_EXE = r"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
HOST = "mysql-175f10f7-railbharat.c.aivencloud.com"
PORT = "28321"
USER = "avnadmin"
DB = "skillmint_db"
DUMP_FILE = r"E:\SkillMint\skillmint_db_backup.sql"

print("==================================================")
print("Aiven MySQL Database Import Tool")
print("==================================================")
print(f"Target Host: {HOST}:{PORT}")
print(f"User:        {USER}")
print(f"Database:    {DB}")
print(f"Dump File:   {DUMP_FILE}")
print("==================================================")

try:
    password = input("Enter Aiven MySQL Password for avnadmin: ").strip()
except Exception:
    password = ""

if not password:
    print("Error: Password cannot be empty.")
    sys.exit(1)

print("\nStep 1: Connecting to Aiven MySQL & importing database backup...")
cmd = [
    MYSQL_EXE,
    f"-h{HOST}",
    f"-P{PORT}",
    f"-u{USER}",
    f"-p{password}",
    "--ssl-mode=REQUIRED",
    "--default-character-set=utf8mb4",
]

try:
    with open(DUMP_FILE, "r", encoding="utf-8") as f:
        process = subprocess.Popen(
            cmd, stdin=f, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True
        )
        stdout, stderr = process.communicate()

    if process.returncode != 0:
        clean_err = "\n".join(
            [
                line
                for line in stderr.splitlines()
                if "Using a password on the command line interface can be insecure"
                not in line
            ]
        )
        print(f"\nImport Failed with exit code {process.returncode}:")
        print(clean_err)
        sys.exit(process.returncode)

    print("\nImport Successful!")
    print("\nStep 2: Verifying imported tables in skillmint_db...")

    verify_cmd = [
        MYSQL_EXE,
        f"-h{HOST}",
        f"-P{PORT}",
        f"-u{USER}",
        f"-p{password}",
        "--ssl-mode=REQUIRED",
        "-e",
        "USE skillmint_db; SHOW TABLES;",
    ]

    verify_proc = subprocess.run(
        verify_cmd, capture_output=True, text=True
    )

    if verify_proc.returncode == 0:
        print("\nVerified Tables in skillmint_db:")
        clean_verify_out = "\n".join(
            [
                line
                for line in verify_proc.stdout.splitlines()
                if "Using a password on the command line interface can be insecure"
                not in line
            ]
        )
        print(clean_verify_out)
    else:
        print("\nTable Verification Failed:")
        print(verify_proc.stderr)

    print("\nImport & Verification complete.")
except Exception as e:
    print(f"Error executing import script: {e}")
    sys.exit(1)
