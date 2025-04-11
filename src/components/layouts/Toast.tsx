import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastPosition } from "react-toastify";

interface ToastProps {
    message: string;
    type: string;
    position: ToastPosition;
    handleDelete?: (value: boolean) => void;
}

export default function Toast({ message, type, position, handleDelete }: ToastProps) {
    
    if(type === "success") {
        return toast.success(message, {
            position,
        });
    }

    if(type === "error") {
        return toast.error(message, {
            position,
        });
    }

    if(type === "question") {
        return toast.warning(
            <div>
                <p>{message}</p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                    <button
                        onClick={() => handleDelete && handleDelete(false)}
                        style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => handleDelete && handleDelete(true)}
                        style={{ padding: '6px 12px', borderRadius: '4px', backgroundColor: '#dc3545', color: 'white', border: 'none' }}
                    >
                        Aceptar
                    </button>
                </div>
            </div>,
            {
                position,
                autoClose: false,
                closeOnClick: false,
                draggable: false,
            }
        );
    }
}