import keyring
import getpass

SERVICE = "SAT_Exam_Test_User"

def main():
    print("Setting up secure test credentials in macOS Keychain...")
    user = input("Enter Test User Email: ")
    keyring.set_password(SERVICE, "username", user)
    
    pwd = getpass.getpass("Enter Test User Password: ")
    keyring.set_password(SERVICE, "password", pwd)
    
    print("Credentials securely saved to macOS Keychain!")

if __name__ == "__main__":
    main()
