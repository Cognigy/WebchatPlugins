import DOMPurify from 'dompurify'

const sanitizedData = (data) => ({
    __html: DOMPurify.sanitize(data)
})

export default sanitizedData;