/*
 * @Author: naluduo233
 * @Date: 2021-04-08 13:59:53
 * @LastEditors: naluduo233
 * @LastEditTime: 2021-04-15 15:05:14
 * @FilePath: /Notebook/examples/8-react/comment-app/src/routes/CommentList.js
 * @Description:
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
// import { connect } from "react-redux";
import CommentList from "../components/CommentList";
// import { initComments, deleteComment } from "../reducers/comments";

import { connect } from "dva";
import { initComments, deleteComment } from "../models/comments";

// 一个 Smart 组件，负责评论列表数据的加载、初始化、删除评论
// 沟通 CommentList 和 state
class CommentListContainer extends Component {
  static propTypes = {
    comments: PropTypes.object, //
    initComments: PropTypes.func,
    onDeleteComment: PropTypes.func,
  };

  componentWillMount() {
    this._loadComments();
  }

  _loadComments() {
    let comments = localStorage.getItem("comments");
    comments = comments ? JSON.parse(comments) : [];
    // this.props.initComments 是 connect 传进来的
    // 可以帮我们把数据初始化到 state 里面去
    this.props.initComments(comments);
  }

  handleDeleteComment(index) {
    const { comments } = this.props.comments; // 注意有 namespace 命名空间
    // props 是不能变的，所以这里新建一个删除了特定下标的评论列表
    const newComments = [
      ...comments.slice(0, index),
      ...comments.slice(index + 1),
    ];
    // 保存最新的评论列表到 LocalStorage
    localStorage.setItem("comments", JSON.stringify(newComments));
    if (this.props.onDeleteComment) {
      // this.props.onDeleteComment 是 connect 传进来的
      // 会 dispatch 一个 action 去删除评论
      this.props.onDeleteComment(index);
    }
  }

  render() {
    return (
      <CommentList
        comments={this.props.comments.comments} 
        onDeleteComment={this.handleDeleteComment.bind(this)}
      ></CommentList>
    );
  }
}

// 评论列表从 state.comments 中获取
const mapStateToProps = ({ comments }) => {
  return {
    comments,
  };
};

const mapDispatchProps = (dispatch) => {
  return {
    // 提供给 CommentListContainer
    // 当从 LocalStorage 加载评论列表以后就会通过这个方法
    // 把评论列表初始化到 state 当中
    initComments: (comments) => {
      dispatch(initComments(comments));
    },
    // 删除评论
    onDeleteComment: (commentIndex) => {
      dispatch(deleteComment(commentIndex));
    },
  };
};

// 将 CommentListContainer connect 到 store
// 会把 comments、initComments、onDeleteComment 传给 CommentListContainer

export default connect(mapStateToProps, mapDispatchProps)(CommentListContainer);
