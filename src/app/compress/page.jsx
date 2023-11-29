"use client"
import React,{useRef,useState,useEffect} from 'react'
import AttachmentIcon from '@mui/icons-material/Attachment';
import { Box,Typography,TextField,Button } from '@mui/material'
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import Radio from '@mui/material/Radio';
import { createFFmpeg,fetchFile } from '@ffmpeg/ffmpeg'; 
import NProgress from 'nprogress';
import CircularProgress from '@mui/material/CircularProgress';
import styles from './page.module.css'

const ffmpeg = createFFmpeg({ log: true, progress: (p) => NProgress.set(p.ratio) });


const IOSSwitch = styled((props) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 2,
        transitionDuration: '300ms',
        '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
                opacity: 1,
                border: 0,
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5,
            },
        },
        '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: '#33cf4d',
            border: '6px solid #fff',
        },
        '&.Mui-disabled .MuiSwitch-thumb': {
            color:
                theme.palette.mode === 'light'
                    ? theme.palette.grey[100]
                    : theme.palette.grey[600],
        },
        '&.Mui-disabled + .MuiSwitch-track': {
            opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
        },
    },
    '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 22,
        height: 22,
    },
    '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
        opacity: 1,
        transition: theme.transitions.create(['background-color'], {
            duration: 500,
        }),
    },
}))


const qualities = [
    { name: 'High', mp4: 18, webm: 24 },
    { name: 'Medium', mp4: 23, webm: 29 },
    { name: 'Low', mp4: 28, webm: 32 },
  ];

const Compress = () => {
    const [file,setFile]=useState(null)
    const [blobUrl, setBlobUrl] = useState(null);
    const [fileName,setFileName] = useState('');
    const [transcodeInProgress, setTranscodeInProgress] = useState(false);
    const [webmEncoder, setWebmEncoder] = useState(false);
    const fileInputRef = useRef(null);
    const [quality, setQuality] = useState(qualities[2]);
    const [ffmpegLoaded, setFfmpegLoaded] = useState(false);
    const [transcodedQuality, setTranscodedQuality] = useState(null);
    const [transcodedCoded, setTranscodedCoded] = useState(null);
    const [transcodedVideo, setTranscodedVideo] = useState(null);
    const [progress, setProgress] = React.useState(10);
    const [isCompressed,setIscompressed] = useState(false)
    
    useEffect(() => {
        const loadFFmpeg = async () => {
          await ffmpeg.load();
          setFfmpegLoaded(true);
        };
    
        loadFFmpeg();
      }, []);

    //   React.useEffect(() => {
    //     const timer = setInterval(() => {
    //       setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
    //     }, 800);
    //     return () => {
    //       clearInterval(timer);
    //     };
    //   }, [progress]);
  
    const handleChange = (event) => {
        console.log('hi');
        setQuality(
        qualities.find((q) => q.name === event.target.value)
        )
    };


    const handlefilebuttonClick = ()=>{
        fileInputRef.current.click()
    }

    const handleVideoChange = (event)=>{
        const selectedFile = event.target.files[0];  
        setFileName(selectedFile ? selectedFile.name : '')
        setFile(selectedFile)
        
      }
      const transcode = async () => {
        if (!ffmpegLoaded) {
          console.log("ffmpeg isn't loaded yet");
          return;
        }
    
        try {
          NProgress.start();
          setTranscodeInProgress(true);
          ffmpeg.FS('writeFile', file.name, await fetchFile(file));           
          const outputFormat = webmEncoder ? 'webm' : 'mp4';
          console.log(outputFormat,"outputFormat");
          if (webmEncoder) {
            await ffmpeg.run(
              '-i',
              file.name,
              '-c:v',
              'libvpx-vp9',
              '-crf',
              quality.webm.toString(),
              '-b:v',
              '0',
              '-row-mt',
              '1',
              `output.${outputFormat}`
            );
          } else {
            await ffmpeg.run(
              '-i',
              file.name,
              '-c:v',
              'libx264',
              '-crf',
              quality.mp4.toString(),
              `output.${outputFormat}`
            );
          }
    
          const data = ffmpeg.FS('readFile', `output.${outputFormat}`);
          setBlobUrl(URL.createObjectURL(new Blob([data.buffer], { type: `video/${outputFormat}` })));
    
        //   const video = document.getElementById('transcoded-preview');
        //   video.src = blobUrl;
    
          setTranscodedQuality(quality);
          setTranscodedCoded(webmEncoder);
          setTranscodedVideo(file);
    
          NProgress.done();
        //   setPreviewTranscoded(true);
          setTranscodeInProgress(false);
          setIscompressed(true)
        } catch (ex) {
          console.error(ex);
          setTranscodeInProgress(false);
        }
      };

      const download = () => {
        const outputFormat = webmEncoder ? 'webm' : 'mp4';
        const anchor = document.createElement('a');
        anchor.href = blobUrl;
        anchor.target = '_blank';
        anchor.download = `output.${outputFormat}`;
    
        // Auto click on a element, trigger the file download
        anchor.click();
        window.location.reload()
      };


  return (
    <Box sx={{height:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'1rem'}}>
          <Typography fontFamily='Rubik' fontSize='30px' fontWeight='600'>Compress Any Video</Typography>
          <TextField 
          label='Upload Video'
          sx={{marginTop:'2rem'}}
           type='text'
           onClick={handlefilebuttonClick}
           value={fileName}
           InputProps={{
            style: {
                borderRadius: '25px',
                height: '50px',
                width:'400px',
                
                fontFamily:'Poppins',
                      fontSize:'12px',
                      fontWeight:'600',
                      color:'black'
              },
              endAdornment:(
                <AttachmentIcon sx={{cursor:'pointer'}}/>
              )
           }}
             />
          <input
              type='file'
              style={{ display: 'none' }}
              onChange={handleVideoChange}
              ref={fileInputRef}
          />

          <Typography fontFamily='Poppins' fontSize='11px' fontWeight='400'>AVI, MP4, WEBM, MKV, upto 2GB</Typography>


          <Typography fontFamily='Rubik' fontSize='25px' fontWeight='500'>Choose Quality</Typography>
          <Box sx={{display:'flex',alignItems:'center',justifyContent:'center',gap:'1rem'}}>
       
        <Typography fontFamily='Poppins' fontSize='11px' fontWeight='600' color={webmEncoder==false? '#ff491c' : 'black'}>Mp4</Typography>
        <IOSSwitch  onChange={() => setWebmEncoder(!webmEncoder)}/>
        <Typography fontFamily='Poppins' fontSize='11px' fontWeight='600' color={webmEncoder==true? '#ff491c' : 'black'}>Webm</Typography>

          </Box>
        {qualities.map((opt)=>(
            <Box key={opt.name} sx={{display:'flex',alignItems:'center',justifyContent:'start'}}>
          <Radio
        checked={quality.name === opt.name}
        onChange={handleChange}
        value={opt.name}
        name="radio-buttons"
        inputProps={{ 'aria-label': opt.name }}
        sx={{width:'50px',    '&.Mui-checked': {
            color: '#ff491c', 
          },}}
      />
      <Typography  sx={{width:'50px'}} fontFamily='Rubik' fontSize='12px' fontWeight='600' color={quality==opt.name? '#ff491c' : 'black'}>{opt.name}</Typography>
          </Box>
        ))}
        <Box sx={{display:'flex',alignItems:'center',justifyContent:'center',gap:'1rem',position:'sticky'}}>

           
     <Button
     onClick={transcode}
     disabled={file==null || transcodeInProgress || isCompressed}
     variant='outlined' sx={{width:'200px',borderRadius:'25px',border:'solid 2px #ff491c',textTransform:'none',fontFamily:'Poppins',fontWeight:'600',fontSize:'12px',color:'black','&:hover':{border:'solid 2px #ff491c',color:'black'}}}>Compress</Button>

        {transcodeInProgress &&(
            <svg className={styles.pl} width="128px" height="128px" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
            <circle className={styles.pl__ring1} cx="64" cy="64" r="60" fill="none" stroke="hsl(3,90%,55%)" stroke-width="8" transform="rotate(-90,64,64)" stroke-linecap="round" stroke-dasharray="377 377" stroke-dashoffset="-376.4"></circle>
            <circle className={styles.pl__ring2} cx="64" cy="64" r="52.5" fill="none" stroke="hsl(13,90%,55%)" stroke-width="7" transform="rotate(-90,64,64)" stroke-linecap="round" stroke-dasharray="329.9 329.9" stroke-dashoffset="-329.3"></circle>
            <circle className={styles.pl__ring3} cx="64" cy="64" r="46" fill="none" stroke="hsl(23,90%,55%)" stroke-width="6" transform="rotate(-90,64,64)" stroke-linecap="round" stroke-dasharray="289 289" stroke-dashoffset="-288.6"></circle>
            <circle className={styles.pl__ring4} cx="64" cy="64" r="40.5" fill="none" stroke="hsl(33,90%,55%)" stroke-width="5" transform="rotate(-90,64,64)" stroke-linecap="round" stroke-dasharray="254.5 254.5" stroke-dashoffset="-254"></circle>
            <circle className={styles.pl__ring5} cx="64" cy="64" r="36" fill="none" stroke="hsl(43,90%,55%)" stroke-width="4" transform="rotate(-90,64,64)" stroke-linecap="round" stroke-dasharray="226.2 226.2" stroke-dashoffset="-225.8"></circle>
            <circle className={styles.pl__ring6} cx="64" cy="64" r="32.5" fill="none" stroke="hsl(53,90%,55%)" stroke-width="3" transform="rotate(-90,64,64)" stroke-linecap="round" stroke-dasharray="204.2 204.2" stroke-dashoffset="-203.9"></circle>
          </svg>
        )}

        </Box>
        {transcodeInProgress &&(
        <Typography fontFamily='Poppins' fontSize='10px' fontWeight='500' color='orangered'>Wait Some Time It will Take Some time to complete the Compression</Typography>
        )}
         {isCompressed && (
            <Button
            onClick={download}
            variant='outlined' sx={{width:'200px',borderRadius:'25px',background:'linear-gradient(to right, #5a3f37, #2c7744)',textTransform:'none',fontFamily:'Poppins',fontWeight:'600',fontSize:'12px',color:'white','&:hover':{background:'linear-gradient(to right, #5a3f37, #2c7744)',color:'white'}}}>Download</Button>
       
         )}






        

          
    </Box>
  )
}

export default Compress