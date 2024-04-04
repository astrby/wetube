import Swal from 'sweetalert2';

export const successAlert = (text: string, t?: any) =>{
    Swal.fire({
        text: text,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        target: t,
    })
}

export const errorAlert = (text: string) =>{
    Swal.fire({
        text: text,
        icon: 'error',
        timer: 1500,
        showConfirmButton: false,
    });
}
