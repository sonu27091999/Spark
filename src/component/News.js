import React, { Component } from 'react'
import NewsItem from './NewsItem'

export class News extends Component {
    constructor() {
        super();
        console.log('Hello i am a constructor from news component');
        this.state = {
            articles: [],
            loading: false
        }
    }
    async componentDidMount(){
        console.log('cdm');
        let url='https://newsapi.org/v2/top-headlines?country=in&category=business&apiKey=e27d749b9d614d81b3ac43aab784185f';
        let data=await fetch(url);
        let parseData= await data.json();
        console.log(parseData);
        this.setState({articles: parseData.articles});
    }

    render() {
        console.log('render');
        return (
            <div className='container my-3'>
                <h2>NewsMonkey - Top headlines</h2>
                <div className="row my-3">
                    {this.state.articles.map((element) => {
                        return <div className="col-md-4" key={element.url}>
                            <NewsItem title={element.title} description={element.description} imageUrl={element.urlToImage} newUrl={element.url} />
                        </div>
                    })};
                </div>
            </div>
        )
    }
}

export default News