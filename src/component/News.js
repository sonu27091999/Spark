import React, { useEffect, useState } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';

const News = (props) => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0)
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    document.title = `${capitalizeFirstLetter(props.category)}  | NewsMonkey`;
    const fetchMoreData = async () => {
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page + 1}&pageSize=${props.pageSize}`;
        setPage(page + 1);  //{ here we swap setPage(page +1) with const url bcz setPage(page+1) is ascynchrounus function and it will take few time to set page--> page+1 but url const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`; so rerendering same page again so we can see console error like children should be unique key like that  } so we manually set page-->page+1 in const url  {`https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page + 1}&pageSize=${props.pageSize}`; and then setState(page+1) so that we ensure that next page is loaded;
        setLoading(true);
        let data = await fetch(url);
        let parseData = await data.json();
        setArticles(articles.concat(parseData.articles));
        setTotalResults(parseData.totalResults);
        setLoading(true);
    };
    useEffect(() => {
        updateNews();
        // eslint - disable - next - line;
    }, [])

    const updateNews = async () => {
        props.setProgress(0);
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
        setLoading(true);
        let data = await fetch(url);
        props.setProgress(30);
        let parseData = await data.json();
        props.setProgress(50);
        setArticles(parseData.articles);
        setTotalResults(parseData.totalResults);
        setLoading(false);
        props.setProgress(100);
    }
    return (
        <>
            <h1 className='text-center' style={{ marginTop: "90px" }}>NewsMonkey - Top headlines from {capitalizeFirstLetter(props.category)}</h1>
            {loading && <Spinner />}
            <InfiniteScroll
                dataLength={articles.length}
                next={fetchMoreData}
                hasMore={articles.length !== totalResults.length}
                loader={<Spinner />}
            >
                <div className="container">
                    <div className="row my-3">
                        {articles.map((element) => {
                            return <div className="col-md-4" key={element.url}>
                                <NewsItem title={element.title} description={element.description} imageUrl={element.urlToImage} newUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                            </div>
                        })};
                    </div>
                </div>
            </InfiniteScroll>
            {/* 
                <div className="container my-3 d-flex justify-content-between">
                    <button type="button" disabled={page <= 1} rel="noreferrer" className="btn btn-dark" onClick={handlePreviousClick}>&larr;Previous</button>
                    <button type="button" disabled={page + 1 > Math.ceil(totalResults / props.pageSize)} rel="noreferrer" className="btn btn-dark" onClick={handleNextClick}>Next &rarr;</button>
                </div> */}
        </>
    )
}

News.defaultProps = {
    country: 'in',
    pageSize: 8,
    category: 'general',
    apiKey: ''
}
News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
    apiKey: PropTypes.string
}
export default News;