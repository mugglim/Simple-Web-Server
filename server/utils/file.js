import { promises } from 'fs';
import path from 'path';

export const getExtName = filePath => {
    return path.extname(filePath).toLocaleLowerCase();
};

export const readFile = async filePath => {
    try {
        const content = await promises.readFile(filePath);
        return { content };
    } catch (error) {
        return { error };
    }
};
