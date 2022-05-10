import React, { Component } from 'react'

export class NewsItem extends Component {
    render() {
        let {title,description,imageUrl,newUrl}=this.props;
        return (
            <div>
                <div className="card my-1" style={{width: "18rem"}}>
                    <img src={imageUrl?imageUrl:'https://images.moneycontrol.com/static-mcnews/2022/02/LIC-IPO-770x433.jpg'} className="card-img-top" alt="..." />
                    <div className="card-body">
                        <h5 className="card-title">{title}</h5>
                        <p className="card-text">{description}</p>
                        <a href={newUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-dark">Read More</a>
                    </div>
                </div>
            </div>
        )
    }
}

export default NewsItem