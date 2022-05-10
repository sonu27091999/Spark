import React, { Component } from 'react'
import NewsItem from './NewsItem'

export class News extends Component {
    constructor() {
        super();
        console.log('Hello i am a constructor from news component');
        this.state = {
            articles: [],
            loading: false,
            page: 1,
            totalResults: 0
        }
    }
    async componentDidMount() {
        console.log('cdm');
        let url = 'https://newsapi.org/v2/top-headlines?country=in&category=business&apiKey=e27d749b9d614d81b3ac43aab784185f&page=1&pageSize=20';
        let data = await fetch(url);
        let parseData = await data.json();
        console.log(parseData);
        this.setState({ articles: parseData.articles, totalResults: parseData.totalResults });
    }
    handlePreviousClick = async () => {
        console.log('previous');
        let url = `https://newsapi.org/v2/top-headlines?country=in&category=business&apiKey=e27d749b9d614d81b3ac43aab784185f&page=${this.state.page - 1}&pageSize=20`;
        let data = await fetch(url);
        let parseData = await data.json();
        console.log(parseData);
        this.setState({
            page: this.state.page - 1,
            articles: parseData.articles
        })
    }
    handleNextClick = async () => {
        console.log('next');
        if (this.state.page + 1 > Math.ceil(this.state.totalResults / 20)) {

        } else {
            let url = `https://newsapi.org/v2/top-headlines?country=in&category=business&apiKey=e27d749b9d614d81b3ac43aab784185f&page=${this.state.page + 1}&pageSize=20`;
            let data = await fetch(url);
            let parseData = await data.json();
            console.log(parseData);
            this.setState({
                page: this.state.page + 1,
                articles: parseData.articles
            })
        }
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
                <div className="container my-3 d-flex justify-content-between">
                    <button type="button" disabled={this.state.page <= 1} rel="noreferrer" className="btn btn-dark" onClick={this.handlePreviousClick}>&larr;Previous</button>
                    <button type="button" disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / 20)} rel="noreferrer" className="btn btn-dark" onClick={this.handleNextClick}>Next &rarr;</button>
                </div>
            </div>
        )
    }
}

export default News