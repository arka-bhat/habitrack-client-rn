import { generateSecureKey } from "@/utils/Crypto";
import Keychain, { STORAGE_TYPE } from "react-native-keychain";

const SECURE_KEYS = {
    MMKV_ENCRYPTION: {
        username: "mmkv-encryption-key",
        service: "com.arkabhat.habitrack.encryption",
        storage: STORAGE_TYPE.AES_GCM,
    },
};

export const getEncryptionKey = async () => {
    // Check if key exists
    let key = await Keychain.getGenericPassword(SECURE_KEYS.MMKV_ENCRYPTION);

    if (!key) {
        const newKey = await generateSecureKey();
        await Keychain.setGenericPassword(SECURE_KEYS.MMKV_ENCRYPTION.username, newKey, {
            service: SECURE_KEYS.MMKV_ENCRYPTION.service,
            accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
            accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
        });
        key = {
            username: SECURE_KEYS.MMKV_ENCRYPTION.username,
            password: newKey,
            service: SECURE_KEYS.MMKV_ENCRYPTION.service,
            storage: SECURE_KEYS.MMKV_ENCRYPTION.storage,
        };
    }

    return key.password;
};
