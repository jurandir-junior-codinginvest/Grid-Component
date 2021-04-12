import { Injectable } from "@angular/core";

@Injectable()
export class Cryptography{
    Encrypt(key:string,text:string):string{
           let keyIndex = 0;
           let encryptedText = "";
           for(let i=0;i<text.length;i++){
               let charCode = text.charCodeAt(i);
               let keyCharCode = key.charCodeAt(keyIndex++);
               let charCodeEncrypted = String.fromCharCode(charCode+keyCharCode);
               keyIndex = keyIndex>key.length?0:keyIndex;
               encryptedText+=charCodeEncrypted;
           }
           return encryptedText;
    }
    Decrypt(key:string,encryptedText:string){
        let keyIndex = 0;
        let text = "";
        for(let i=0;i<encryptedText.length;i++){
            let encryptedTextCharCode = encryptedText.charCodeAt(i);
            let keyCharCode = key.charCodeAt(keyIndex++);
            let charCodeEncrypted = String.fromCharCode(encryptedTextCharCode-keyCharCode);
            keyIndex = keyIndex>key.length?0:keyIndex;
            text+=charCodeEncrypted;
        }
        return text;
    }
}