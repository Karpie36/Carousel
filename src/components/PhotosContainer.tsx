import React from 'react';
import '../styles/PhotosContainer.less';
import Photo from "./Photo";

type PhotosContainerProps = {
    active: boolean,
    position: string,
    imgsIds: Array<number>,
    imgsSLUGs: Array<string>
}

class PhotosContainer extends React.Component<PhotosContainerProps, {}> {
    constructor(props: PhotosContainerProps) {
        super(props);
    }

    componentWillUpdate() {
    }

    render() {
        const classes = `PhotosContainer ${this.props.active ? 'prev' : 'next'}`
        return (
            <div className={classes} style={{'marginLeft': this.props.position, 'display': this.props.active ? 'flex' : 'none'}} >
            {
                this.props.imgsIds.map((id:number) => {
                    return <Photo photoSLUG={this.props.imgsSLUGs[id]} photoNumber={id}/>
                })
            }
            </div>
        )
    }
}

export default PhotosContainer;