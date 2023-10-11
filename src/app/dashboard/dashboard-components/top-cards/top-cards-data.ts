export interface topcard {
    bgcolor: string,
    icon: string,
    title: string,
    subtitle: string
}

export const topcards: topcard[] = [

    {
        bgcolor: 'success',
        icon: 'bi bi-people',
        title: '500',
        subtitle: 'Usuarios registrados'
    },
    {
        bgcolor: 'danger',
        icon: 'bi bi-shop',
        title: '200',
        subtitle: 'Estudios registrados'
    },
    {
        bgcolor: 'warning',
        icon: 'bi bi-file-earmark-arrow-up',
        title: '456',
        subtitle: 'Diseños subidos'
    },


]
