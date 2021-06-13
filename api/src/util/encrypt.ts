import bcrypt from 'bcryptjs';

export const encryptValue = async (value: string) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(value, salt);
}