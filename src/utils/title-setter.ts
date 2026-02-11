import { useEffect } from 'react'

function DocumentTitleSetter(title) {

    useEffect(() => {
        document.title = title;
    }, [title]);
}
export default DocumentTitleSetter