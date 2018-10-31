import React, { Component } from 'react';
import { Alert, Container, Table } from 'react-bootstrap';

import ReactStars from 'react-stars'
import './App.scss';
import './Card.scss';

import Client from './Client';

class Card extends Component {
  state= {
    addon: {
      data: null,
    },
    categories: {
      data: null,
    },
    error: null,
  };

  async componentDidMount() {
    const { match } = this.props;
    const { slug } = match.params;
    let addonData;
    let categoryData;
    try {
      [addonData, categoryData] = await Promise.all([
        Client.getAddon(slug),
        Client.getCategories()
      ]);
    } catch(err) {
      return this.setState({ error: true });
    }

    const catMap = {};
    /* eslint-disable array-callback-return */
    categoryData.map((cat, idx) => {
      catMap[cat.slug] = cat.name;
    });

    this.setState({
      addon: {
        data: addonData
      },
      categories: {
        data: catMap
      },
    });
  }

	getAuthors(addon) {
	  return addon.authors.map((author, idx) => {
			return <li key={author.username + idx}><a href={author.url}>{author.name}</a></li>
		});
	}

	getCategories(addon) {
   	return addon.categories.firefox.map((cat, idx) => {
      const catName = this.state.categories.data[cat] || cat;
      return <li key={cat}><a href={`https://addons.mozilla.org/en-US/firefox/extensions/${cat}`}>{catName}</a></li>
		});
	}

  truncateSummary(addon) {
    const titleLength = addon.name.length
    const summaryLength = addon.summary.length;
    const maxLengthCombined = 70;
    const summaryLimit = maxLengthCombined - titleLength;
    return {
      isTruncated: summaryLength > summaryLimit,
      summary: addon.summary.substring(0, summaryLimit),
      summaryLength,
      titleLength,
      maxLengthCombined,
      summaryLimit,
      total: maxLengthCombined - (titleLength + summaryLength),
    };
  }

  render() {

    const addon = this.state.addon.data;
    const error = this.state.error;

    if (error === true) {
      return <Container as="main"><span className="error">Something went wrong, please try later.</span></Container>;
    }

    if (addon === null) {
      return <Container as="main"><span className="loading">Loading...</span></Container>;
    }

		const cats = this.getCategories(addon);
    const authors = this.getAuthors(addon);
    const truncatedAddonSummary = this.truncateSummary(addon);

    return (
			<Container as="main">
				<div className="Card">
					<img className="logo" width="64" height="64" src={addon.icon_url} alt="" />
          <div className="content">
            <div className="titles">
              <div className="authorship">
              <h2>{addon.name}</h2>
                <div className="byline">
                  <span>by</span>
                  <ul className="authors">
                    {authors}
                  </ul>
                </div>
              </div>
              <button className="install">Add to Firefox</button>
            </div>
            <div className="description">{truncatedAddonSummary.summary + (truncatedAddonSummary.isTruncated ? '…' : '')}</div>
            <ul className="meta">
              <li><ReactStars
                count={5}
                value={addon.ratings.average}
                color1="#c2c2c2"
                color2="#0C0C0D"
                half={true}
                edit={false} /></li>

              <li><a href={addon.ratings_url}>{addon.ratings.text_count} reviews</a></li>
              <li><span className="users">{addon.average_daily_users} users</span></li>
              { cats ?
              <li><div>
                <span>{cats.length > 1 ? 'Categories' : 'Category'}:</span>
                <ul className="cats">
                  {cats}
                </ul>
              </div></li> : null }
            </ul>
          </div>
				</div>

        <div className="explanation">
          <p>In a future revision of addons.mozilla.org we are limiting the displayed summary text if the combined total of the Add-on title and summary is greater than <strong>{truncatedAddonSummary.maxLengthCombined}</strong> characters.</p>

          <p>Above is a preview of what your content will look like with that limit in place.</p>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Title Letter Count</th>
                <th>Summary Letter Count</th>
                <th>Total for Title and Summary</th>
                <th>Remaining Chars</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{truncatedAddonSummary.titleLength}</td>
                <td>{truncatedAddonSummary.summaryLength}</td>
                <td>{truncatedAddonSummary.titleLength + truncatedAddonSummary.summaryLength}</td>
                <td>{truncatedAddonSummary.total}</td>
              </tr>
            </tbody>
          </Table>

          { truncatedAddonSummary.total > 0 ?
              <Alert variant="success"><p>✅ Your content already fits within the limit, no action is required.</p></Alert> :
              <Alert variant="danger"><p>🚫 For your summary to not be truncated you'll need to reduce it by <strong>{-truncatedAddonSummary.total}</strong> characters.</p></Alert> }
        </div>
			</Container>
    );
  }
}

export default Card;
