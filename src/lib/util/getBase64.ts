import { RcFile } from 'antd/lib/upload';


export default function getBase64(img: RcFile, callback: (url: string) => void) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
};
