import React, { useState, useEffect } from 'react';
import { X, File, Camera } from 'lucide-react';
import { Button, Spinner } from '@chakra-ui/react';
import { useStore } from '../store/useStore';

type ProfileType = {
    desc: string,
    name: string,
    picture: string,
}

interface EditChatProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    profile: ProfileType | null;
    setProfile: (profile: ProfileType) => void;
}

export const EditChatProfileModal: React.FC<EditChatProfileModalProps> = ({ isOpen, onClose, profile, setProfile }) => {
    const [preview, setPreview] = useState<any>(null);
    const [image, setImage] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [nameErr, setNameErr] = useState(false);
    const [descriptionErr, setDescriptionErr] = useState(false);
    const { chatUser } = useStore();

    useEffect(() => {
        if (profile) {
            setPreview(profile.picture)
            setImage(profile.picture)
            setName(profile.name)
            setDescription(profile.desc)
        }
    }, [profile])

    const handleImageChange = (event: any) => {
        const file = event.target.files[0];

        if (file) {
            setPreview(URL.createObjectURL(file));

            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string)
            };
            reader.readAsDataURL(file);
        }
    }

    const handleSave = async () => {
        if (!name) {
            setNameErr(true)
            return
        }
        if (!description) {
            setDescriptionErr(true)
            return
        }

        setIsSaving(true)
        console.log('save ', image, name, description)
        try {
            const response = await chatUser.profile.update({
                name,
                description,
                picture: image
            })

            console.log('response = ', response)

            setProfile({ name, desc: description, picture: image })
            onClose()
        } catch (err) {
            console.log('update profile err: ', err)
        }
        setIsSaving(false)
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-[480px] glass border border-white/10 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <h2 className="text-xl font-semibold">Edit Profile</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className='px-8 pt-8 pb-4 flex justify-center flex-col items-center'>
                    <label className="cursor-pointer">
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                        {
                            preview ?
                                <img
                                    src={preview} // Replace with actual camera icon path
                                    className="w-32 h-32 object-cover border-2 border-gray-300 rounded-full"
                                /> :
                                <Camera className='w-32 h-32' />
                        }
                    </label>

                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                        className={`w-full mt-2 bg-white/5 px-4 py-2 rounded-lg outline-none placeholder:text-white/40 ${nameErr ? "border-b-2 border-red-500" : ""}`}
                    />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder='Bio'
                        className={`mt-4 w-full bg-white/5 px-4 py-2 rounded-lg outline-none placeholder:text-white/40 ${descriptionErr ? "border-b-2 border-red-500" : ""}`}
                        rows={5}
                    />
                    {
                        isSaving ? <Spinner className='mt-4' /> : <Button className='mt-4' variant={'solid'} colorScheme='blue' onClick={handleSave}>Save Changes</Button>
                    }
                </div>
            </div>
        </div>
    )
}