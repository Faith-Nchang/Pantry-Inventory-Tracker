"use client";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Modal, Typography, Stack, TextField, Button } from "@mui/material";
import { doc, collection, deleteDoc, getDocs, query, setDoc, getDoc } from "firebase/firestore";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};
const dynamicStyle = {
    color: 'green',
    padding: '10px',
    borderRadius: '5px',
    fontSize: "50px"
  };

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [prompt, setPrompt] = useState('');

  const auth = getAuth();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push("/"); // Redirect to the login page
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/"); // Redirect to login page
    } catch (error) {
      console.log("Error signing out: ", error.message);
    }
  };

  const updateInventory = async () => {
    try {
      const snapshot = query(collection(firestore, 'inventory'));
      const docs = await getDocs(snapshot);
      const inventoryList = [];
      docs.forEach((doc) => {
        inventoryList.push({
          name: doc.id,
          ...doc.data(),
        });
      });
      setInventory(inventoryList);
    } catch (error) {
      console.log("Error updating inventory: ", error.message);
    }
  };

  const filteredItems = inventory.filter(item =>
    item.name.includes(prompt)
  );

  const addItem = async (item) => {
    try {
      const docRef = doc(collection(firestore, 'inventory'), item);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        await setDoc(docRef, { quantity: quantity + 1 });
      } else {
        await setDoc(docRef, { quantity: 1 });
      }

      await updateInventory();
    } catch (error) {
      console.log("Error adding item: ", error.message);
    }
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const removeItem = async (item) => {
    try {
      const docRef = doc(collection(firestore, 'inventory'), item);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        if (quantity === 1) {
          await deleteDoc(docRef);
        } else {
          await setDoc(docRef, { quantity: quantity - 1 });
        }
      }

      await updateInventory();
    } catch (error) {
      console.log("Error removing item: ", error.message);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box width="100vw" height="100vh" display='flex' flexDirection='column' justifyContent='center' alignItems='center' gap={2} bgcolor={'#B3E5FC'}>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          
          <Stack width="100%" direction='row' spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Stack direction='row' spacing={2}>
              <Button
                variant="outlined"
                onClick={() => {
                  addItem(itemName);
                  setItemName("");
                  handleClose();
                }}
                sx={{ padding: '12px 24px' }}
              >
                Add
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>
      <Typography style={dynamicStyle}>
            Welcome onboard, {user ? user.displayName : "Guest"}!
    </Typography>
      <Stack direction={'row'} spacing={2}>
        <Button
          variant="contained" onClick={handleOpen}>
          Add New Item
        </Button>

        <TextField
          id="outlined-basic"
          label="Search Items"
          variant="outlined"
          onChange={(e) => setPrompt(e.target.value)}
        />

        <Button variant="contained" onClick={handleLogout}>
          Logout
        </Button>
      </Stack>

      <Box border="1px solid #333">
        <Box width='800px' height='100px' bgcolor='#ADDBE6' alignItems='center' justifyContent='center' display='flex'>
          <Typography variant="h2" color="#333">
            Inventory Management
          </Typography>
        </Box>

        <Stack height='300px' width='800px' spacing={2} overflow='auto'>
          {filteredItems.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="100px"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#f0f0f0'}
              paddingX={5}
            >
              <Typography variant="h3" color="#333" spacing={2} textAlign={'center'} style={{ fontSize: '25px' }}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h3" color="#333" spacing={2} style={{ fontSize: '25px' }}>
                Quantity: {quantity}
              </Typography>
              <Stack direction='row' spacing={2}>
                <Button
                  variant="contained"
                  onClick={() => addItem(name)}
                >
                  Add
                </Button>
                <Button
                  variant="contained"
                  onClick={() => removeItem(name)}
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
