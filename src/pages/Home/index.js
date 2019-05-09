import React, { Component } from 'react';
import { connect } from 'dva';
import axios from 'axios';

export default connect (state => ({...state})) (class Home extends Component {
	componentDidMount () {
		axios.get('/telematics/v3/weather?location=北京&output=json&ak=tQydkkwXfEtSNgvAEHUr1v6u0GbXUvZo')
		.then( data => {
			console.log(data);
		});
	}
	render () {
		return (
			<div>
				<h1 style={{textAlign: 'center'}}>欢迎来到Bids</h1>
			</div>
		);
	}
});