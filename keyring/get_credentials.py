import keyring

SERVICE = "SAT_Exam_Test_User"

def get_credentials():
    """Retrieve credentials from macOS Keychain."""
    username = keyring.get_password(SERVICE, "username")
    password = keyring.get_password(SERVICE, "password")
    return username, password

def main():
    print("Retrieving secure test credentials from macOS Keychain...")
    username, password = get_credentials()
    
    if username and password:
        print(f"✅ Found credentials for: {username}")
        print(f"🔒 Password: {'*' * len(password)} (hidden for security)")
    else:
        print("❌ No credentials found. Run 'make set-test-credentials' to store them.")

if __name__ == "__main__":
    main()
