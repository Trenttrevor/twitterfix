"use client"

import { app } from "@/firebase";
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage'
import {addDoc, collection, getFirestore, serverTimestamp} from 'firebase/firestore'
import { useSession } from "next-auth/react"
import { useEffect, useRef, useState } from "react";
import { HiOutlinePhotograph } from 'react-icons/hi';

export default function Input() {
    const { data: session } = useSession()
    const imagePickRef = useRef(null)
    const [imageFileUrl, setImageFileUrl] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const [imageFileUploading, setImageFileUploading] = useState(false)
    const [text, setText] = useState('')
    const [postLoading, setPostLoading] = useState(false)

    const db = getFirestore(app)

    console.log(imageFileUrl)

    const addImageToPost = (e)=> {
        const file = e.target.files[0] 
        if(file){
            setSelectedFile(file)
            setImageFileUrl(URL.createObjectURL(file))
            
        }
    }

    useEffect(()=>{
        if(selectedFile){
            uploadImageToStorage()
        }
    },[selectedFile])

    const uploadImageToStorage = () => {
        setImageFileUploading(true)
        const storage = getStorage(app)
        const fileName = new Date().getTime() + '-' + selectedFile.name
        const storageRef = ref(storage, fileName)
        const uploadTask = uploadBytesResumable(storageRef, selectedFile)
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                console.log('upload is' + progress + "% done")
            },
            (error)=> {
                console.log(error)
                setImageFileUploading(false)
                setImageFileUrl(null)
                setSelectedFile(null)
            },
            ()=>{
                getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl)=> {
                    setImageFileUrl(downloadUrl)
                    setImageFileUploading(false)
                })
            }
        )

    }

    const handleSubmit = async () => {
        setPostLoading(true)
        const docRef = await addDoc(collection(db, 'posts'),{
            uid: session.user.uid,
            name: session.user.name,
            username: session.user.username,
            text: text,
            profileImg: session.user.image,
            timestamp: serverTimestamp(),
            image:imageFileUrl
        })
        setPostLoading(false)
        setText('')
        setImageFileUrl(null)
        setSelectedFile(null)
        location.reload()
    }

    if (!session) return null
    return (
        <div className='flex border-b border-gray-200 p-3 space-x-3 w-full'>
            <img
                src={session.user.image}
                alt="user"
                className='h-11 w-11 rounded-full cursor-pointer hover:brightness-95'
            />
            <div className="w-full divide-y divide-gray-200">
                <textarea
                    placeholder="Whats happening"
                    rows="2"
                    value={text}
                    onChange={(e)=>setText(e.target.value)}
                    className="w-full border-none outline-none tracking-wide min-h-[50px] text-gray-700"
                ></textarea>
                {
                    selectedFile && (
                        <img src={imageFileUrl} alt="file"  className={`w-full max-h-[250px] object-cover cursor-pointer ${imageFileUploading ? 'animate-pulse':''}`}/>
                    )
                }
                <div className='flex items-center justify-between pt-2.5'>
                    <HiOutlinePhotograph
                    onClick={()=> imagePickRef.current.click()}
                        className='h-10 w-10 p-2 text-sky-500 hover:bg-sky-100 rounded-full cursor-pointer'
                    />
                    <input hidden type="file" ref={imagePickRef} accept="image/*" onChange={addImageToPost}/>
                    <button
                    disabled={text.trim() ==='' || postLoading || imageFileUploading}
                        className='bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50'
                        onClick={handleSubmit}
                    >
                        Post
                    </button>
                </div>
            </div>
        </div>
    )
}
