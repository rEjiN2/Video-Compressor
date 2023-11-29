"use client"
import React from 'react'
import {Box,Typography,Button} from '@mui/material'
import Image from 'next/image'
import Logo from '../../public/logo.webp'
import { useRouter } from 'next/navigation'


const Main = () => {
  const router = useRouter()

 const handleCompress = (e)=>{
  e.preventDefault()
    router.push('/compress')
 }



  return (
    <Box sx={{height:'100vh',background:'linear-gradient(to right, #00c9ff, #92fe9d)',display:'flex',flexDirection:'column',alignItems:'center'}}>
      <Box sx={{marginTop:'5rem'}}>
        <Image src={Logo} alt='Logo' />
      </Box>
      <Typography fontFamily='Rubik' fontSize='35px' fontWeight='800' marginTop='5rem'>Want to Compress Your Video</Typography>
       <Box sx={{display:'flex',alignItems:'center',justifyContent:'center',gap:'1rem',height:'50vh'}}>
       <Button variant='outlined' sx={{border:'solid 2px #ff491c',borderRadius:'22px',color:'white',textTransform:'none',fontFamily:'Rubik',fontSize:'15px',fontWeight:'500',background:'linear-gradient(to right, #6a9113, #141517)','&:hover':{background:'linear-gradient(to right, #6a9113, #141517)',border:'solid 2px #ff491c'}}}>Donate 100Rs</Button>
       <Button onClick={handleCompress} variant='outlined' sx={{border:'solid 2px #ff491c',borderRadius:'22px',color:'black',textTransform:'none',fontFamily:'Rubik',fontSize:'15px',fontWeight:'500','&:hover':{border:'solid 2px #ff491c'}}}>Compress Video</Button>
       <Button variant='outlined' sx={{border:'solid 2px #ff491c',borderRadius:'22px',color:'white',textTransform:'none',fontFamily:'Rubik',fontSize:'15px',fontWeight:'500',background:'linear-gradient(to right, #6a9113, #141517)','&:hover':{background:'linear-gradient(to right, #6a9113, #141517)',border:'solid 2px #ff491c'}}}>Buy Source Code for $2</Button>
      </Box>
         
    </Box>
  )
}

export default Main