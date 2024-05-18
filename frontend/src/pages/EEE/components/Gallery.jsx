import React, { useState, useEffect } from 'react'
import { ref, getDownloadURL } from 'firebase/storage';
import axios from "axios"
import Swal from "sweetalert2"
import { storage } from '../../../Config/firebaseconfig'
import Lightbox from 'react-18-image-lightbox';
import 'react-18-image-lightbox/style.css';
import { baseApiURL } from '../../../baseUrl';

function Gallery() {
    const [gallery, setGallery] = useState([]);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);
    const [preloadedImages, setPreloadedImages] = useState([]);

    useEffect(() => {
        const preloadImages = [];
        gallery.forEach((img) => {
            const image = new Image();
            image.src = img.image;
            image.onload = () => {
                preloadImages.push({
                    src: img.image,
                    width: image.width,
                    height: image.height,
                });

                if (preloadImages.length === gallery.length) {
                    setPreloadedImages(preloadImages);
                }
            };
        });
    }, [gallery]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${baseApiURL()}/getEEEgallery`);
                const galleryDetails = response.data.map(async (item) => {
                    const storageRef = ref(storage, item.image);
                    const imageUrl = await getDownloadURL(storageRef);
                    return {
                        name: item.name,
                        alttext: item.alttext,
                        image: imageUrl,
                    };
                });

                Promise.all(galleryDetails).then((galleries) => {
                    setGallery(galleries);

                });
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Error Fetching Gallery Images!',
                    confirmButtonText: 'OK',
                });
            }
        };

        fetchData();
    }, []);


    const openLightbox = (index) => {
        setPhotoIndex(index);
        setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    return (
        <div>
            <section className="blog pt_110 xs_pt_75 pb_100 xs_pb_60 bg-light" id='gallery'>
                <div className="container">
                    <div className="row">
                        <div className="col-xl-6 col-md-9 col-lg-7 m-auto">
                            <div className="section_heading heading_center mb_30 xs_mb_30">
                                <h2 style={{ color: "#000000" }}>Our Gallery</h2>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {gallery.map((img, index) => (
                            <div className="col-xl-4 wow fadeInUp" data-wow-duration="1s" key={index}>
                                <div className="single_blog" onClick={() => openLightbox(index)}>
                                    <div className="single_blog_img">
                                        <img src={img.image} alt="blog" className="img-fluid w-100" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {lightboxOpen && (
                <Lightbox
                    mainSrc={preloadedImages[photoIndex].src}
                    nextSrc={preloadedImages[(photoIndex + 1) % preloadedImages.length].src}
                    prevSrc={preloadedImages[(photoIndex + preloadedImages.length - 1) % preloadedImages.length].src}
                    onCloseRequest={closeLightbox}
                    onMovePrevRequest={() => setPhotoIndex((photoIndex + preloadedImages.length - 1) % preloadedImages.length)}
                    onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % preloadedImages.length)}
                    imageTitle={`Image ${photoIndex + 1} of ${preloadedImages.length}`}
                    imageCaption={`Image ${photoIndex + 1}`}
                    imagePadding={100}
                />
            )}
        </div>
    )
}

export default Gallery