import React, { useState, useEffect } from 'react';
import { X, Mic, MicOff, Video, VideoOff, MonitorUp, Settings, User, Camera, MoveLeft, Plus, Search } from 'lucide-react';
import { Button, Switch, Spinner } from "@chakra-ui/react"

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FirstStepProps {
  setStep: (step: number) => void;
}

interface SecondStepProps {
  isPublic: boolean;
  setIsPublic: (param: boolean) => void;
  setStep: (step: number) => void;
}

interface ThirdStepProps {
  setStep: (step: number) => void;
}

const FirstStep = ({ setStep }: FirstStepProps) => {
  const [image, setImage] = useState<any>(null);
  const [groupName, setGroupName] = useState("");
  const [groupNameErr, setGroupNameErr] = useState(false);
  const [groupDescription, setGroupDescription] = useState("");
  const [groupDescriptionErr, setGroupDescriptionErr] = useState(false);

  const handleImageChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleNext = () => {
    if (!groupName) {
      setGroupNameErr(true)
      return
    }
    if (!groupDescription) {
      setGroupDescriptionErr(true)
      return
    }

    setStep(2)
  }

  return (
    <div className='w-full p-4 text-center'>
      <div className='w-full flex items-center justify-center mt-4'>
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          {
            image ?
              <img
                src={image} // Replace with actual camera icon path
                alt="Upload"
                className="w-32 h-32 object-cover border-2 border-gray-300 rounded-full"
              /> :
              <Camera className='w-32 h-32' />
          }
        </label>
      </div>

      <input
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="Group Name"
        className={`w-full mt-2 bg-white/5 px-4 py-2 rounded-lg outline-none placeholder:text-white/40 ${groupNameErr ? "border-b-2 border-red-500" : ""}`}
      />
      <textarea
        value={groupDescription}
        onChange={(e) => setGroupDescription(e.target.value)}
        placeholder='Group Description'
        className={`mt-4 w-full bg-white/5 px-4 py-2 rounded-lg outline-none placeholder:text-white/40 ${groupDescriptionErr ? "border-b-2 border-red-500" : ""}`}
        rows={5}
      />
      <Button className='mt-4' variant={'solid'} colorScheme='teal' onClick={handleNext}>Next</Button>
    </div>
  )
}

const SecondStep = ({ setStep, isPublic, setIsPublic }: SecondStepProps) => {
  const [isGateGroup, setIsGateGroup] = useState(true)

  const handleNext = () => {
    setStep(3)
  }

  return (
    <div className='w-full p-4 text-center'>
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setIsPublic(true)}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${isPublic ? 'bg-white/10' : 'hover:bg-white/5'
            }`}
        >
          <span>Public</span>
        </button>
        <button
          onClick={() => setIsPublic(false)}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${!isPublic ? 'bg-white/10' : 'hover:bg-white/5'
            }`}
        >
          <span>Private</span>
        </button>
      </div>
      <div className='flex mt-6'>
        <div className='flex flex-1 flex-col text-left'>
          <label className='text-md'>Gated Group</label>
          <label className='text-sm font-light text-gray-400'>Enable gating including invite and access rules</label>
        </div>
        <div className='flex items-center justify-center'>
          <Switch isChecked={isGateGroup} size={'lg'} onChange={(e) => setIsGateGroup(e.target.checked)} />
        </div>
      </div>
      {
        isGateGroup && <>
          <div className='flex flex-1 flex-col text-left mt-6'>
            <label className='text-md'>Conditions to Join</label>
            <label className='text-sm font-light text-gray-400'>Add a condition to join or remove all conditions for no rules</label>
            <Button className='mt-4'>
              <Plus className='w-4 h-4' /> Add Conditions
            </Button>
          </div>
          <div className='flex flex-1 flex-col text-left mt-6'>
            <label className='text-md'>Conditions to Chat</label>
            <label className='text-sm font-light text-gray-400'>Add a condition to chat or leave it empty for no rules</label>
            <Button className='mt-4'>
              <Plus className='w-4 h-4' /> Add Conditions
            </Button>
          </div>
        </>
      }
      <Button className='mt-4' variant={'solid'} colorScheme='teal' onClick={handleNext}>Next</Button>
    </div>
  )
}

const ThirdStep = ({ setStep }: ThirdStepProps) => {
  const [members, setMembers] = useState<Array<string>>([]);
  const [isSearch, setIsSearch] = useState(false);
  const [search, setSearch] = useState("");

  const handleCreateGroup = () => {
    setStep(3)
  }

  const handleSearch = () => {
    setIsSearch(true)
    setMembers([...members, search])
    setIsSearch(false)
  }

  const handleAdd = () => {
    console.log('handle added')
  }

  return (
    <div className='w-full p-4 text-center'>
      <div className='w-full flex justify-between'>
        <label className='text-gray-400'>Add Wallets</label>
        <label className='text-gray-400'>{members.length} / 5000 members</label>
      </div>
      <div className='flex mt-3 items-center justify-center gap-4'>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Web3 domain or 0x123..."
          className={`w-full bg-white/5 px-4 py-2 rounded-lg outline-none placeholder:text-white/40`}
        />
        {
          isSearch ? <Spinner className='w-4 h-4' /> :
            <button onClick={handleSearch}>
              <Search className='w-4 h-4' />
            </button>
        }
      </div>

      {
        members.map((e, i) =>
          <div key={i} className='flex items-center justify-between mt-1 bg-gray-800 px-4 py-3 rounded-lg outline-none'>
            <div className='flex items-center'>
              <User />
              <span>{e}</span>
            </div>
            <button onClick={handleAdd}>Add</button>
          </div>)
      }

      <Button className='mt-4' variant={'solid'} colorScheme='teal' onClick={handleCreateGroup}>Create Group</Button>
    </div>
  )
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const [step, setStep] = useState(1);
  const [isPublic, setIsPublic] = useState(true);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-[480px] glass border border-white/10 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          {step > 1 && <button
            onClick={() => setStep(step - 1)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <MoveLeft className="w-4 h-4" />
          </button>}
          <h2 className="text-xl font-semibold">Create Group</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {
          step == 1 ? <FirstStep setStep={setStep} /> : step == 2 ? <SecondStep setStep={setStep} isPublic={isPublic} setIsPublic={setIsPublic} />
            : <ThirdStep setStep={setStep} />
        }
      </div>
    </div>
  );
};