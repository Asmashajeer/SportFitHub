    import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


interface props{
    icon:React.ReactNode,
    title:string,
    description:string,
    onConfirm:()=>void
}


const ConfirmDialog=({icon,title,description,onConfirm}:props)=>{
    return(
        <AlertDialog>
            <AlertDialogTrigger asChild>            
            <button className="p-1 rounded-full hover:bg-gray-600 cursor-pointer">
               {icon}
            </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>
                {title}
                </AlertDialogTitle>
                <AlertDialogDescription>
                {description}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                onClick={() => onConfirm()}
                className= "bg-red-600 hover:bg-red-700"
                >
                Confirm
                </AlertDialogAction>
            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}


export default ConfirmDialog;