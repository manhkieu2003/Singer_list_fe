import { useEffect, useRef, useState } from "react";
import { getContacts, saveContact, updateContact, updatePhoto } from "./api/ContactService";
import Header from "./Nav/Header";
import { Navigate, Route, Routes } from "react-router-dom";
import ContactList from "./Components/ContactList";
import ContactDetail from "./Components/ContactDetail";
import { toastError } from "./api/ToastService";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {
  const modalRef = useRef();
  const fileRef = useRef();
  console.log(fileRef)
  const [data, setData] = useState({})
  const[file,setFile]=useState(undefined)

  const [currentPage, setCurrentPage] = useState(0)
  const [values,setValues]= useState({
    name:"",
    email:"",
    title:"",
    phone:"",
    address:"",
    status:""
  })
  const onchange=(event)=>{
      setValues({...values,[event.target.name]:event.target.value})
     
  }
  const onchangeFile=(event)=>{
    setFile(event.target.files[0])
    console.log(event.target.files[0])
   
  }
  const handleNewContact= async (event)=>{
    event.preventDefault();
    try{
      const {data} =   await saveContact(values)
      const formdata = new FormData();
      formdata.append('file',file,file.name)
      formdata.append('id',data.id)
      const {data: photoUrl} = await updatePhoto(formdata)
      console.log(photoUrl)
      toggleModal(false)
      setFile(undefined)
      setValues({
        name:"",
    email:"",
    title:"",
    phone:"",
    address:"",
    status:""
      })
      fileRef.current.value=null
      getAllContacts()

    }catch(error)
    {
      console.log(error)
    }
  }
 
  // console.log(data)
  console.log(values)
  const getAllContacts = async (page = 0, size = 10) => {
    try {
      setCurrentPage(page)
      const { data } = await getContacts(page, size)
      setData(data)
      console.log(data)
    } catch (error) {
      console.log(error)
      fileRef.current.value=null
    }

  }
  const updateContact = async (contact) => {
    try {
      const { data } = await saveContact(contact);
      console.log(data);
    } catch (error) {
      console.log(error);
      //  toastError(error.message);
    }
  };
  const updateImage = async (formData) => {
    try {
      const { data: photoUrl } = await updatePhoto(formData);
    } catch (error) {
      console.log(error);
      //  toastError(error.message);
    }
  };
  
  const toggleModal = (show) => show? modalRef.current.showModal() :modalRef.current.close()
   // showmodal của dialog
   
   
  
  useEffect(() => {
    getAllContacts()
  }, [])
  return (
    <>
  
      <Header toggleModal={toggleModal} nbOfContacts={data.totalElements} />
      <main className="main">
        <div className="container">
          <Routes>
            <Route path="/" element={<Navigate to={'/contacts'} />}></Route>
            <Route path="/contacts" element={<ContactList data={data} currentPage={currentPage} getAllContacts={getAllContacts} />}></Route>
            <Route path="/contacts/:id" element={<ContactDetail updateContact={updateContact} updateImage={updateImage} />}></Route>
          </Routes>
        </div>
      </main>
      {/* Modal */}
      <dialog ref={modalRef} className="modal" id="modal">
        <div className="modal__header">
          <h3>New Contact</h3>
          <i onClick={()=>toggleModal(false)} className="bi bi-x-lg"></i>
        </div>
        <div className="divider"></div>
        <div className="modal__body">
          <form onSubmit={handleNewContact}>
            <div className="user-details">
              <div className="input-box">
                <span className="details">Name</span>
                <input type="text" value={values.name} onChange={onchange} name='name' required />
              </div>
              <div className="input-box">
                <span className="details">Email</span>
                <input type="text" value={values.email} onChange={onchange}  name='email' required />
              </div>
              <div className="input-box">
                <span className="details">Title</span>
                <input type="text" value={values.title} onChange={onchange} name='title' required />
              </div>
              <div className="input-box">
                <span className="details">Phone Number</span>
                <input type="text" value={values.phone} onChange={onchange} name='phone' required />
              </div>
              <div className="input-box">
                <span className="details">Address</span>
                <input type="text" value={values.address} onChange={onchange} name='address' required />
              </div>
              <div className="input-box">
                <span className="details">Account Status</span>
                <input type="text"  value={values.status} onChange={onchange} name='status' required />
              </div>
              <div className="file-input">
                <span className="details">Profile Photo</span>
                <input type="file" onChange={onchangeFile} ref={fileRef} name='photo' required />
              </div>
            </div>
            <div className="form_footer">
              <button type='button' onClick={()=>toggleModal(false)}  className="btn btn-danger">Cancel</button>
              <button type='submit' className="btn">Save</button>
            </div>
          </form>
        </div>
      </dialog>

      </>
  );
}

export default App;
