import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';

export class News extends Component {
    static defaultProps = {
        country: 'in',
        pageSize: 8,
        category: 'general'
    }
    static propTypes = {
        country: PropTypes.string,
        pageSize: PropTypes.number,
        category: PropTypes.string
    }
    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    fetchMoreData = async () => {
        this.setState({ page: this.state.page + 1 });
        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=e27d749b9d614d81b3ac43aab784185f&page=${this.state.page}&pageSize=${this.props.pageSize}`;
        this.setState({ loading: true });
        let data = await fetch(url);
        let parseData = await data.json();
        // console.log(parseData);
        this.setState({
            articles: this.state.articles.concat(parseData.articles),
            totalResults: parseData.totalResults,
            loading: false
        });
    };
    constructor(props) {
        super(props);
        // console.log('Hello i am a constructor from news component');
        this.state = {
            articles: [],
            loading: false,
            page: 1,
            totalResults: 0
        }
        document.title = `${this.capitalizeFirstLetter(this.props.category)}  | NewsMonkey`;
    }
    componentDidMount() {
        // console.log('cdm');
        // const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=e27d749b9d614d81b3ac43aab784185f&page=1&pageSize=${this.props.pageSize}`;
        // this.setState({ loading: true });
        // let data = await fetch(url);
        // let parseData = await data.json();
        // console.log(parseData);
        // this.setState({
        //     articles: parseData.articles,
        //     totalResults: parseData.totalResults,
        //     loading: false
        // });
        this.updateNews();
    }
    updateNews = async () => {
        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=e27d749b9d614d81b3ac43aab784185f&page=${this.state.page}&pageSize=${this.props.pageSize}`;
        this.setState({ loading: true });
        let data = await fetch(url);
        let parseData = await data.json();
        // console.log(parseData);
        this.setState({
            articles: parseData.articles,
            totalResults: parseData.totalResults,
            loading: false
        });
    }
    // handlePreviousClick = () => {
    //     // console.log('previous');
    //     // let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=e27d749b9d614d81b3ac43aab784185f&page=${this.state.page - 1}&pageSize=${this.props.pageSize}`;
    //     // this.setState({ loading: true });
    //     // let data = await fetch(url);
    //     // let parseData = await data.json();
    //     // // console.log(parseData);
    //     // this.setState({
    //     //     page: this.state.page - 1,
    //     //     articles: parseData.articles,
    //     //     loading: false
    //     // })
    //     this.setState({ page: this.state.page - 1 });
    //     this.updateNews();
    // }
    // handleNextClick = () => {
    //     // console.log('next');
    //     // if (!(this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize))) {
    //     //     let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=e27d749b9d614d81b3ac43aab784185f&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`;
    //     //     this.setState({ loading: true });
    //     //     let data = await fetch(url);
    //     //     let parseData = await data.json();
    //     //     // console.log(parseData);
    //     //     this.setState({
    //     //         page: this.state.page + 1,
    //     //         articles: parseData.articles,
    //     //         loading: false
    //     //     })
    //     // }
    //     this.setState({ page: this.state.page + 1 });
    //     this.updateNews();
    // }

    render() {
        // console.log('render');
        return (
            <>
                <h1 className='text-center'>NewsMonkey - Top headlines from {this.capitalizeFirstLetter(this.props.category)}</h1>
                {this.state.loading && <Spinner />}
                <InfiniteScroll
                    dataLength={this.state.articles.length}
                    next={this.fetchMoreData}
                    hasMore={this.state.articles.length !== this.state.totalResults.length}
                    loader={<Spinner />}
                >
                    <div className="container">
                        <div className="row my-3">
                            {this.state.articles.map((element) => {
                                return <div className="col-md-4" key={element.url}>
                                    <NewsItem title={element.title} description={element.description} imageUrl={element.urlToImage} newUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                                </div>
                            })};
                        </div>
                    </div>
                </InfiniteScroll>
                {/* 
                <div className="container my-3 d-flex justify-content-between">
                    <button type="button" disabled={this.state.page <= 1} rel="noreferrer" className="btn btn-dark" onClick={this.handlePreviousClick}>&larr;Previous</button>
                    <button type="button" disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize)} rel="noreferrer" className="btn btn-dark" onClick={this.handleNextClick}>Next &rarr;</button>
                </div> */}
            </>
        )
    }
}

export default News