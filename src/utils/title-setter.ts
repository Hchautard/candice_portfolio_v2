import { useEffect } from 'react'

function DocumentTitleSetter(title: string) {
    useEffect(() => {
        document.title = title === 'Accueil' ? "L'Anomalie" : `${title} — L'Anomalie`;
    }, [title]);
}
export default DocumentTitleSetter