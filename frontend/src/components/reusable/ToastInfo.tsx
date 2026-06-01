import toast from "react-hot-toast"

const ToastInfo=({message}:{message:string})=> {
  return (
    toast.custom(<div className='text-blue-800 bg-blue-300 border rounded-lg p-0 m-0'><p> {message}</p></div>)
  )
}



export default ToastInfo

