import {auth, provider} from "../firebase-config"
import {signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile} from 'firebase/auth'

import Cookies from 'universal-cookie'

import { Flex, Text, Box, Input, Button } from "@chakra-ui/react";


import {React, useState} from "react";
import { ColorSigniture } from "../utils/_Palette";

const cookies = new Cookies()

export const Auth = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");
    const [username, setUsername] = useState("");
    const [newUser, setNewUser] = useState(false);

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            cookies.set("auth-token", result.user.refreshToken);
            props.setIsAuth(true)
            props.setUserName(auth.currentUser.displayName)
        } catch (err) {
            console.error(err);

        }
    };

    const signInWithEmailPassword = async () => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            cookies.set("auth-token", result.user.refreshToken);
            props.setIsAuth(true)
            props.setUserName(auth.currentUser.displayName)
        } catch (err) {
            console.error(err);
            if (err.message.includes("wrong-password")) {
                alert("비밀번호가 틀렸습니다. 비밀번호가 기억나지 않으신다면, taewan@kaist.ac.kr 또는 010-9085-2356으로 연락부탁드립니다.");
            } else if (err.message.includes("user-not-found")) {
                alert("계정정보가 없습니다.")
            } else if (err.message.includes("invalid-email")) {
                alert("올바른 이메일 형식이 아닙니다.")
            } else {
                alert('Error: ' + err.message);
            }
        }
    }

    const triggerCall = () => {
        if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.callKitHandler) {
            console.log("Native bridge available, sending message to iOS");
            window.webkit.messageHandlers.callKitHandler.postMessage("triggerCall");
        } else {
            console.warn("Native bridge not available.");
        }
    };
    


    const signUpWithEmailPassword = async () => {
        if (password !== passwordCheck) {
            alert("비밀번호가 일치하지 않습니다. 동일한 비밀번호를 입력해주세요");
        } else {
            try {
                const result = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(auth.currentUser, {
                    displayName: username
                });
                cookies.set("auth-token", result.user.refreshToken);
                props.setIsAuth(true)
                props.setUserName(auth.currentUser.displayName)
            } catch (err) {
                console.error(err);
                if (err.message.includes("email-already-in-use")) {
                    alert("이미 가입된 이메일입니다. 비밀번호가 기억나지 않으신다면, taewan@kaist.ac.kr 또는 010-9085-2356으로 연락부탁드립니다.");
                } else if (err.message.includes("invalid-email")) {
                    alert("올바른 이메일 형식이 아닙니다.")
                } else if (err.message.includes("weak-password")) {
                    alert("비밀번호는 6자 이상으로 설정해주세요")
                } else {
                    alert('Error: ' + err.message);
                }
            }

        }

    }



    return (
        <Box minH={'calc(100vh - 130px)'} alignContent="center" mx='12px'>
            <Flex flexDir={'column'} justifyContent={'center'} alignItems={'center'} mt='-100px'>
            <Text fontSize={'20px'} fontWeight={400} mb='0px'>Meet your personal counselor through your own diary 🙂</Text>
            <Text fontSize={'32px'} fontWeight={700}>Log In</Text>
            <Input placeholder="✉️ Please enter your email address" type="email" onChange={(e) => setEmail(e.target.value)}  mb='12px'/>
            <Input  placeholder="🔑 Please enter your password" type="password" onChange={(e) => setPassword(e.target.value)} mb='30px'/>
            <Button   
                backgroundColor={ColorSigniture}
                color={'white'}
                width={'100%'} 
                borderRadius={'20px'}
                onClick={signInWithEmailPassword}>
           Log In with Email/Password</Button>
            </Flex>
            <Text mt='12px'>Having trouble logging in?</Text>
      
            <Button onClick={()=>triggerCall()}>전화 알림 테스트</Button>

        </Box>
    )
}
export default Auth;
