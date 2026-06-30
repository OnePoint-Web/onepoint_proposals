import styles from './VideoPlayer.module.scss'
import { parseVideoUrl } from '@/utils/video'

export default function VideoPlayer({
    url = '',
    size, //full or undefined
}){
    const video = parseVideoUrl(url)

    // if (!url) return null

    // if (!video) {
    //     return <p>Invalid or unsupported video URL</p>
    // }

    return( 
            <div  className={`${styles['video-container']} ${size === 'full' && styles['full']}`}>

                {!url && ( <p>Video preview</p> )}
                {video && (
                    <iframe
                        src={video.embedUrl}
                        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                        allowFullScreen
                        referrerPolicy="strict-origin-when-cross-origin"
                    />    
                )}

                {url && !video && (
                     <p>Invalid or unsupported video URL</p>
                )}
                    
            </div>
                
      
    )   
}