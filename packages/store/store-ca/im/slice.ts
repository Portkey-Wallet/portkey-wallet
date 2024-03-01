import { createSlice } from '@reduxjs/toolkit';

import { IMStateType, UpdateChannelAttributeTypeEnum } from './type';
import {
  removeChannel,
  nextChannelList,
  resetIm,
  setChannelList,
  setHasNext,
  updateChannelAttribute,
  setChannelMessageList,
  nextChannelMessageList,
  addChannelMessage,
  deleteChannelMessage,
  updateChannelMessageAttribute,
  addChannel,
  setRelationId,
  setRelationToken,
  setGroupInfo,
  updateGroupInfo,
  removeChannelMembers,
  transferChannelOwner,
  addChannelMembers,
  setPinList,
  nextPinList,
  setLastPinMessage,
  updateChannelMessageRedPackageAttribute,
  updateChannelRedPackageAttribute,
  setRedPackageConfig,
  cleanALLChannelMessagePin,
} from './actions';
import { formatChannelList } from './util';
import { MessageTypeEnum, ParsedRedPackage } from '@portkey-wallet/im';

const initialState: IMStateType = {
  channelListNetMap: {},
  hasNextNetMap: {},
  channelMessageListNetMap: {},
  relationIdNetMap: {},
  relationTokenNetMap: {},
  groupInfoMapNetMap: {},
  redPackageConfigMap: {},
  pinListNetMap: {},
  lastPinNetMap: {},
};
export const imSlice = createSlice({
  name: 'im',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(setRelationId, (state, action) => {
        state.relationIdNetMap[action.payload.network] = action.payload.relationId;
      })
      .addCase(setChannelList, (state, action) => {
        state.channelListNetMap[action.payload.network] = formatChannelList(action.payload.channelList);
      })
      .addCase(nextChannelList, (state, action) => {
        const { network, channelList } = action.payload;

        const preList = state.channelListNetMap[network]?.list || [];
        let newChannelList = {
          list: [...preList, ...channelList.list],
          cursor: channelList.cursor,
        };
        newChannelList = formatChannelList(newChannelList);

        state.channelListNetMap[network] = newChannelList;
      })
      .addCase(setHasNext, (state, action) => {
        state.hasNextNetMap[action.payload.network] = action.payload.hasNext;
      })
      .addCase(updateChannelAttribute, (state, action): any => {
        const { network, channelId, value, type } = action.payload;

        const preChannelList = state.channelListNetMap[network];
        if (!preChannelList) return state;

        const channelList = {
          ...preChannelList,
          list: preChannelList.list.map(item => {
            if (item.channelUuid === channelId) {
              let plusAttribute: typeof value | undefined;
              switch (type) {
                case UpdateChannelAttributeTypeEnum.UPDATE_UNREAD_CHANNEL:
                  plusAttribute = {
                    unreadMessageCount: item.unreadMessageCount + 1,
                  };
                  break;
                default:
                  break;
              }

              return {
                ...item,
                ...value,
                ...plusAttribute,
              };
            }
            return item;
          }),
        };

        state.channelListNetMap[network] = formatChannelList(channelList);
        return state;
      })
      .addCase(updateChannelRedPackageAttribute, (state, action): any => {
        const { network, channelId, id, value } = action.payload;

        const preChannelList = state.channelListNetMap[network];
        if (!preChannelList) return state;

        const channelList = {
          ...preChannelList,
          list: preChannelList.list.map(item => {
            if (
              item.channelUuid === channelId &&
              item.lastMessageType === MessageTypeEnum.REDPACKAGE_CARD &&
              (item.lastMessageContent as ParsedRedPackage)?.data?.id === id
            ) {
              return {
                ...item,
                redPackage: value,
              };
            }
            return item;
          }),
        };

        state.channelListNetMap[network] = formatChannelList(channelList);
        return state;
      })
      .addCase(addChannel, (state, action): any => {
        const { network, channel } = action.payload;

        const preChannelList = state.channelListNetMap[network];
        const preList = preChannelList?.list || [];
        if (preList.find(item => item.channelUuid === channel.channelUuid)) {
          // return {
          //   ...state,
          //   channelListNetMap: {
          //     ...state.channelListNetMap,
          //     [network]: {
          //       ...preChannelList,
          //       list: preList.map(item => {
          //         if (item.channelUuid === channel.channelUuid) {
          //           return channel;
          //         }
          //         return item;
          //       }),
          //     },
          //   },
          // };
          return state;
        }

        const channelList = formatChannelList({
          list: [channel, ...preList],
          cursor: preChannelList?.cursor || '',
        });

        state.channelListNetMap[network] = channelList;
        return state;
      })
      .addCase(removeChannel, (state, action): any => {
        const { network, channelId } = action.payload;

        const preChannelList = state.channelListNetMap[network];
        if (!preChannelList) return state;
        let channelList = {
          ...preChannelList,
          list: preChannelList.list.filter(item => item.channelUuid !== channelId),
        };
        channelList = formatChannelList(channelList);

        state.channelListNetMap[network] = channelList;
        return state;
      })
      .addCase(setChannelMessageList, (state, action) => {
        const { network, channelId, list } = action.payload;
        return {
          ...state,
          channelMessageListNetMap: {
            ...state.channelMessageListNetMap,
            [network]: {
              ...state.channelMessageListNetMap?.[network],
              [channelId]: list,
            },
          },
        };
      })
      .addCase(nextChannelMessageList, (state, action) => {
        const { network, channelId, list } = action.payload;
        return {
          ...state,
          channelMessageListNetMap: {
            ...state.channelMessageListNetMap,
            [network]: {
              ...state.channelMessageListNetMap?.[network],
              [channelId]: [...list, ...(state.channelMessageListNetMap?.[network]?.[channelId] || [])],
            },
          },
        };
      })
      .addCase(addChannelMessage, (state, action) => {
        const { network, channelId, message } = action.payload;
        return {
          ...state,
          channelMessageListNetMap: {
            ...state.channelMessageListNetMap,
            [network]: {
              ...state.channelMessageListNetMap?.[network],
              [channelId]: [...(state.channelMessageListNetMap?.[network]?.[channelId] || []), message],
            },
          },
        };
      })
      .addCase(deleteChannelMessage, (state, action) => {
        const { network, channelId, id } = action.payload;
        return {
          ...state,
          channelMessageListNetMap: {
            ...state.channelMessageListNetMap,
            [network]: {
              ...state.channelMessageListNetMap?.[network],
              [channelId]: [
                ...(state.channelMessageListNetMap?.[network]?.[channelId]?.filter(item => item.id !== id) || []),
              ],
            },
          },
        };
      })
      .addCase(updateChannelMessageAttribute, (state, action) => {
        const { network, channelId, sendUuid, value } = action.payload;
        return {
          ...state,
          channelMessageListNetMap: {
            ...state.channelMessageListNetMap,
            [network]: {
              ...state.channelMessageListNetMap?.[network],
              [channelId]: [
                ...(state.channelMessageListNetMap?.[network]?.[channelId]?.map(item => {
                  if (item.sendUuid === sendUuid) {
                    return {
                      ...item,
                      ...value,
                    };
                  }
                  return item;
                }) || []),
              ],
            },
          },
        };
      })
      .addCase(updateChannelMessageRedPackageAttribute, (state, action) => {
        const { network, channelId, id, value } = action.payload;
        return {
          ...state,
          channelMessageListNetMap: {
            ...state.channelMessageListNetMap,
            [network]: {
              ...state.channelMessageListNetMap?.[network],
              [channelId]: [
                ...(state.channelMessageListNetMap?.[network]?.[channelId]?.map(item => {
                  if (
                    item.type === MessageTypeEnum.REDPACKAGE_CARD &&
                    (item.parsedContent as ParsedRedPackage)?.data.id === id
                  ) {
                    return {
                      ...item,
                      redPackage: value,
                    };
                  }
                  return item;
                }) || []),
              ],
            },
          },
        };
      })
      .addCase(setRelationToken, (state, action) => {
        state.relationTokenNetMap[action.payload.network] = action.payload.token;
      })
      .addCase(setGroupInfo, (state, action) => {
        const { network, groupInfo } = action.payload;
        return {
          ...state,
          groupInfoMapNetMap: {
            ...state.groupInfoMapNetMap,
            [network]: {
              ...state.groupInfoMapNetMap?.[network],
              [groupInfo.uuid]: groupInfo,
            },
          },
        };
      })
      .addCase(updateGroupInfo, (state, action) => {
        const { network, channelId, value } = action.payload;

        const preChannelInfo = state.groupInfoMapNetMap?.[network]?.[channelId];
        if (!preChannelInfo) return state;

        return {
          ...state,
          groupInfoMapNetMap: {
            ...state.groupInfoMapNetMap,
            [network]: {
              ...state.groupInfoMapNetMap?.[network],
              [channelId]: {
                ...preChannelInfo,
                ...value,
              },
            },
          },
        };
      })
      .addCase(addChannelMembers, (state, action) => {
        const { network, channelId, memberInfos } = action.payload;
        const preChannelInfo = state.groupInfoMapNetMap?.[network]?.[channelId];
        if (!preChannelInfo) return state;

        const [adminMember, ...otherMembers] = preChannelInfo.members;
        const otherMembersMap: Record<string, boolean> = {};
        otherMembers.forEach(member => {
          otherMembersMap[member.relationId] = true;
        });
        const newMemberInfos = memberInfos.filter(member => !otherMembersMap[member.relationId]);
        const newMembers = [adminMember, ...otherMembers, ...newMemberInfos];

        return {
          ...state,
          groupInfoMapNetMap: {
            ...state.groupInfoMapNetMap,
            [network]: {
              ...state.groupInfoMapNetMap?.[network],
              [channelId]: {
                ...preChannelInfo,
                members: newMembers,
              },
            },
          },
        };
      })
      .addCase(removeChannelMembers, (state, action) => {
        const { network, channelId, members } = action.payload;

        const preChannelInfo = state.groupInfoMapNetMap?.[network]?.[channelId];
        if (!preChannelInfo) return state;

        const removeMemberMap: Record<string, boolean> = {};
        members.forEach(relationId => {
          removeMemberMap[relationId] = true;
        });
        const newMembers = preChannelInfo.members.filter(member => !removeMemberMap[member.relationId]);

        return {
          ...state,
          groupInfoMapNetMap: {
            ...state.groupInfoMapNetMap,
            [network]: {
              ...state.groupInfoMapNetMap?.[network],
              [channelId]: {
                ...preChannelInfo,
                members: newMembers,
              },
            },
          },
        };
      })
      .addCase(transferChannelOwner, (state, action) => {
        const { network, channelId, relationId } = action.payload;

        const preChannelInfo = state.groupInfoMapNetMap?.[network]?.[channelId];
        if (!preChannelInfo) return state;

        const [preOwner, ...otherMembers] = preChannelInfo.members;
        const newOwner = otherMembers.find(member => member.relationId === relationId);
        if (!preOwner || !newOwner) return state;
        const newMembers = otherMembers.filter(member => member.relationId !== relationId);
        newMembers.reverse();
        newMembers.push({
          ...preOwner,
          isAdmin: false,
        });
        newMembers.push({
          ...newOwner,
          isAdmin: true,
        });
        newMembers.reverse();

        return {
          ...state,
          groupInfoMapNetMap: {
            ...state.groupInfoMapNetMap,
            [network]: {
              ...state.groupInfoMapNetMap?.[network],
              [channelId]: {
                ...preChannelInfo,
                members: newMembers,
              },
            },
          },
        };
      })

      .addCase(setRedPackageConfig, (state, action) => {
        const { network, value } = action.payload;
        return {
          ...state,
          redPackageConfigMap: {
            ...state.redPackageConfigMap,
            [network]: value,
          },
        };
      })

      .addCase(setPinList, (state, action) => {
        const { network, channelId, list, fetchTime } = action.payload;
        const preListObj = state.pinListNetMap?.[network]?.[channelId];
        if (preListObj && preListObj.fetchTime > fetchTime) {
          return state;
        }

        return {
          ...state,
          pinListNetMap: {
            ...state.pinListNetMap,
            [network]: {
              ...state.pinListNetMap?.[network],
              [channelId]: {
                list,
                fetchTime,
              },
            },
          },
        };
      })
      .addCase(nextPinList, (state, action) => {
        const { network, channelId, list, fetchTime } = action.payload;

        let _list = list;
        const preListObj = state.pinListNetMap?.[network]?.[channelId];
        if (preListObj) {
          if (preListObj.fetchTime > fetchTime) return state;
          const preListMap: Record<string, boolean> = {};
          preListObj.list.forEach(item => {
            preListMap[item.sendUuid] = true;
          });
          _list = list.filter(item => !preListMap[item.sendUuid]);
        }

        return {
          ...state,
          pinListNetMap: {
            ...state.pinListNetMap,
            [network]: {
              ...state.pinListNetMap?.[network],
              [channelId]: {
                list: [..._list, ...(preListObj?.list || [])],
                fetchTime,
              },
            },
          },
        };
      })
      .addCase(cleanALLChannelMessagePin, (state, action) => {
        const { network, channelId } = action.payload;
        return {
          ...state,
          channelMessageListNetMap: {
            ...state.channelMessageListNetMap,
            [network]: {
              ...state.channelMessageListNetMap?.[network],
              [channelId]: [
                ...(state.channelMessageListNetMap?.[network]?.[channelId]?.map(item => {
                  return {
                    ...item,
                    pinInfo: undefined,
                  };
                }) || []),
              ],
            },
          },
        };
      })
      .addCase(setLastPinMessage, (state, action) => {
        const { network, channelId, message, fetchTime } = action.payload;
        const preLastPinObj = state.lastPinNetMap?.[network]?.[channelId];
        if (preLastPinObj && preLastPinObj.fetchTime > fetchTime) {
          return state;
        }

        return {
          ...state,
          lastPinNetMap: {
            ...state.lastPinNetMap,
            [network]: {
              ...state.lastPinNetMap?.[network],
              [channelId]: {
                message,
                fetchTime,
              },
            },
          },
        };
      })

      .addCase(resetIm, (state, action) => {
        return {
          ...state,
          channelListNetMap: {
            ...state.channelListNetMap,
            [action.payload]: undefined,
          },
          hasNextNetMap: {
            ...state.hasNextNetMap,
            [action.payload]: undefined,
          },
          channelMessageListNetMap: {
            ...state.channelMessageListNetMap,
            [action.payload]: undefined,
          },
          relationIdNetMap: {
            ...state.relationIdNetMap,
            [action.payload]: undefined,
          },
          relationTokenNetMap: {
            ...state.relationTokenNetMap,
            [action.payload]: undefined,
          },
          groupInfoMapNetMap: {
            ...state.groupInfoMapNetMap,
            [action.payload]: undefined,
          },
          pinListNetMap: {
            ...state.pinListNetMap,
            [action.payload]: undefined,
          },
          lastPinNetMap: {
            ...state.lastPinNetMap,
            [action.payload]: undefined,
          },
        };
      });
  },
});

export default imSlice;
