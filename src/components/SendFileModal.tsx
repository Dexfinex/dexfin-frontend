import React, { useState, useEffect } from 'react';
import { X, File } from 'lucide-react';
import { Button } from '@chakra-ui/react';

interface SendFileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSendFile: (type: string, base64: string) => void;
    file: any;
}

export const SendFileModal: React.FC<SendFileModalProps> = ({ isOpen, onClose, onSendFile, file }) => {
    const [base64, setBase64] = useState<any>(null);
    const [errMessage, setErrMessage] = useState("");

    useEffect(() => {
        if (file) {
            setErrMessage("")
            if (file.size > 1 * 1024 * 1024) {
                setErrMessage("Please select a file smaller than 1MB.")
                return
            }

            const reader = new FileReader()
            reader.readAsDataURL(file); // Convert file to Base64
            reader.onload = () => {
                console.log("Base64:", reader.result); // Base64 string
                setBase64(reader.result)
            };
            reader.onerror = (err) => {
                console.log("Base64 err:", err)
            };
        }
    }, [file])

    const handleSend = () => {
        const fileType = (file.type.startsWith("image/") ? "Image" : "File")

        const content = {
            content: base64,
            name: file.name,
            size: file.size,
            type: file.type
        }
        console.log('file content = ', content)
        onSendFile(fileType, JSON.stringify(content))
        onClose()
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-[480px] glass border border-white/10 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <h2 className="text-xl font-semibold">Send file</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className='px-8 pt-8 pb-4 flex justify-center flex-col items-center'>
                    {
                        file.type.startsWith("image/") ? <img src={base64} className='w-40' /> :
                            <div className='flex items-center'>
                                <span className='p-2 rounded-full bg-white/50 mr-4'>
                                    <File className='w-12 h-12' />
                                </span>
                                <span className='text-xl'>{file.name}</span>
                            </div>
                    }
                    {errMessage && <p className='test-red-500'>{errMessage}</p>}
                    <Button className='mt-8 w-40' colorScheme='blue' disabled={errMessage ? true : false} onClick={handleSend}>Send</Button>
                </div>
            </div>
        </div>
    )
}