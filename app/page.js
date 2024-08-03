'use client';
import { Box, Typography, Button } from "@mui/material";
import { useRouter } from 'next/navigation';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "@/firebase"; // Adjust import path as needed

export default function Home() {
  const [user, setUser] = useState(null);
  const router = useRouter(); 

  const handleRedirect = () => {
    console.log('Redirect button clicked');
    router.push('/inventory');
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/inventory");
    } catch (error) {
      console.log("Error signing in with Google", error.message);
    }
  }

  return (
    <Box width="100vw" height="100vh" display='flex' flexDirection='column' justifyContent='center' alignItems='center' gap={2} bgcolor={'#B3E5FC'}>
      <Typography id="modal-modal-title" variant="h2" component="h2" sx={{ color: '#003366' }} width={'80%'} textAlign={'center'} fontWeight={'bold'} marginBottom ="10px">
        Welcome to your personalized Inventory Management
      </Typography>
      <Box display="flex" gap={2} flexDirection="row">
      <Typography>
        {user ? 
        (<Button variant="contained" onClick={handleRedirect}>Go to Inventory</Button>) :
        (<Button variant ="contained" onClick={signInWithGoogle}>
          Sign in with Google
        </Button>)
        }


      </Typography>
      <Typography>
          <Button onClick={handleRedirect} variant="contained">
            Access Inventory
          </Button>
      </Typography>

      </Box>
     
      
    </Box>
  );
};
