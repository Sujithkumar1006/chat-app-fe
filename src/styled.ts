import styled from "styled-components";

export const Container = styled.div`
  .message-list {
    height: calc(100vh - 70px);
    overflow: scroll;
    scrollbar-width: none;
    > li {
      border-bottom: 1px solid #e6e3e6;
      background: #f4f6f8;
    }
  }
  .top-menu {
    position: sticky;
    top: 0;
    background: #6581b9;
    .add-btn {
      color: #78bc9e;
    }
  }
`;

export const ModalContainer = styled.div`
  position: relative;
  width: 600px;
  padding: 64px 32px 32px;
  .close-btn {
    border: none;
    position: absolute;
    top: 15px;
    right: 15px;
    border-radius: 50%;
    height: 32px;
    width: 32px;
    background: grey;
    &:hover {
      color: red;
    }
  }
  .user-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow: auto;
    height: 600px;
    margin-top: 32px;
    padding-right: 32px;
    > li {
      display: flex;
      align-items: center;
      cursor: pointer;
      border: 1px solid grey;
      border-radius: 4px;
      padding: 4px;
      position: relative;

      > img {
        height: 48px;
        width: 48px;
        margin-right: 12px;
      }
      > p {
        font-size: 18px;
        font-weight: bold;
      }
      .round-status {
        position: absolute;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: 2px solid white;
        margin-left: 8px;
        top: 2px;
        left: 36px;
      }
    }
  }
`;

export const ChatBoxContiner = styled.div`
  display: flex;
  flex-direction: column;
  .top-ctn {
    padding: 8px;
    position: sticky;
    display: flex;
    top: 0;
    background: white;
    align-items: center;
    > h4 {
      font-size: 24px;
      width: 100%;
      font-weight: bold;
      color: black;
      .round-status {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: 2px solid white;
        margin-left: 8px;
        position: absolute;
      }
    }
    .settings-ctn {
      position: relative;
      .settings-modal {
        position: absolute;
        padding: 8px;
        top: 34px;
        width: 220px;
        background: #ffff;
        right: 10px;
        box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
        .lg-btn {
          color: black;
          display: flex;
          align-items: center;
          font-weight: bold;
          > img {
            height: 24px;
            width: 24px;
            margin-right: 12px;
          }
        }
      }
    }
    .three-dots-btn {
      > img {
        height: 32px;
        width: 32px;
      }
    }
  }
  .chats-ctn {
    background: #e7ebee;
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px;
    max-height: calc(100vh - 124px);
  }
  .bubble-content {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  .message-bubble {
    max-width: 70%;
    padding: 12px 16px;
    border-radius: 20px;
    display: inline-block;
    position: relative;
    word-break: break-word;

    .timestamp {
      font-size: 0.75rem;
      margin-top: 6px;
      display: block;
      text-align: right;
    }
  }
  .message-bubble.left {
    align-self: flex-start;
    background-color: #ffff;
    border-top-left-radius: 4px;
    .bubble-content {
      > p {
        color: #242424;
      }
      .timestamp {
        color: #242424;
      }
    }
  }
  .message-bubble.right {
    align-self: flex-end;
    background-color: #6581b9;
    border-top-right-radius: 4px;
    .bubble-content {
      > p {
        color: #ffff;
      }
    }
  }
  .input-ctn {
    position: sticky;
    bottom: 10px;
    border-top: 1px solid #cfcfcf;
    box-shadow: rgba(0, 0, 0, 0.15) 2.6px 1.95px 1.95px;
    padding: 12px 0 0 0;
    > div {
      display: flex;
      align-items: start;
      > input {
        color: black;
        border-radius: 8px;
        padding: 8px;
        width: calc(100% - 120px);
        margin-left: 24px;
        &::placeholder {
          color: black;
        }
        &:focus {
          outline-width: 0;
        }
      }
    }
  }
`;
