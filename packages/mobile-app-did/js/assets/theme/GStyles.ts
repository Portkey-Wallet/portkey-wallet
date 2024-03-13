import { pTd } from 'utils/unit';

export default {
  pwTip: {
    marginTop: 3,
    color: 'red',
  },
  flex0: {
    flex: 0,
  },
  flex1: {
    flex: 1,
  },
  flexRowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  flexCol: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
  itemStart: {
    alignItems: 'flex-start',
  },
  itemCenter: {
    alignItems: 'center',
  },
  itemEnd: {
    alignItems: 'flex-end',
  },
  alignCenter: {
    alignSelf: 'center',
  },
  alignEnd: {
    alignSelf: 'flex-end',
  },
  flexCenter: {
    justifyContent: 'center',
  },
  flexEnd: {
    justifyContent: 'flex-end',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textAlignCenter: {
    textAlign: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  spaceAround: {
    justifyContent: 'space-around',
  },
  width100: {
    width: '100%',
  },
  containerSpaceBetween: {
    minHeight: '100%',
    justifyContent: 'space-between',
    paddingBottom: pTd(20),
  },
  containerViewSpaceBetween: {
    justifyContent: 'space-between',
    paddingBottom: pTd(20),
  },
  //-------- margin -----------
  marginArg: function (...ags: number[]) {
    switch (ags.length) {
      case 1:
        return {
          marginTop: pTd(ags[0]),
          marginRight: pTd(ags[0]),
          marginBottom: pTd(ags[0]),
          marginLeft: pTd(ags[0]),
        };
      case 2:
        return {
          marginVertical: pTd(ags[0]),
          marginHorizontal: pTd(ags[1]),
        };
      case 3:
        return {
          marginTop: pTd(ags[0]),
          marginHorizontal: pTd(ags[1]),
          marginBottom: pTd(ags[2]),
        };
      case 4:
        return {
          marginTop: pTd(ags[0]),
          marginRight: pTd(ags[1]),
          marginBottom: pTd(ags[2]),
          marginLeft: pTd(ags[3]),
        };
    }
  },
  //-------- padding -----------
  paddingArg: function (...ags: number[]) {
    switch (ags.length) {
      case 1:
        return {
          paddingTop: pTd(ags[0]),
          paddingRight: pTd(ags[0]),
          paddingBottom: pTd(ags[0]),
          paddingLeft: pTd(ags[0]),
        };
      case 2:
        return {
          paddingVertical: pTd(ags[0]),
          paddingHorizontal: pTd(ags[1]),
        };
      case 3:
        return {
          paddingTop: pTd(ags[0]),
          paddingHorizontal: pTd(ags[1]),
          paddingBottom: pTd(ags[2]),
        };
      case 4:
        return {
          paddingTop: pTd(ags[0]),
          paddingRight: pTd(ags[1]),
          paddingBottom: pTd(ags[2]),
          paddingLeft: pTd(ags[3]),
        };
    }
  },
  //-------- raduis -----------
  radiusArg: function (...ags: number[]) {
    switch (ags.length) {
      case 1:
        return {
          borderTopLeftRadius: pTd(ags[0]),
          borderTopRightRadius: pTd(ags[0]),
          borderBottomRightRadius: pTd(ags[0]),
          borderBottomLeftRadius: pTd(ags[0]),
        };
      case 2:
        return {
          borderTopLeftRadius: pTd(ags[0]),
          borderTopRightRadius: pTd(ags[1]),
          borderBottomRightRadius: pTd(ags[0]),
          borderBottomLeftRadius: pTd(ags[1]),
        };
      case 3:
        return {
          borderTopLeftRadius: pTd(ags[0]),
          borderTopRightRadius: pTd(ags[1]),
          borderBottomLeftRadius: pTd(ags[1]),
          borderBottomRightRadius: pTd(ags[2]),
        };
      case 4:
        return {
          borderTopLeftRadius: pTd(ags[0]),
          borderTopRightRadius: pTd(ags[1]),
          borderBottomRightRadius: pTd(ags[2]),
          borderBottomLeftRadius: pTd(ags[3]),
        };
    }
  },
  paddingTop: function (n: number) {
    return { paddingTop: pTd(n) };
  },
  paddingBottom: function (n: number) {
    return { paddingBottom: pTd(n) };
  },
  paddingLeft: function (n: number) {
    return { paddingLeft: pTd(n) };
  },
  paddingRight: function (n: number) {
    return { paddingRight: pTd(n) };
  },
  marginTop: function (n: number) {
    return { marginTop: pTd(n) };
  },
  marginBottom: function (n: number) {
    return { marginBottom: pTd(n) };
  },
  marginLeft: function (n: number) {
    return { marginLeft: pTd(n) };
  },
  marginRight: function (n: number) {
    return { marginRight: pTd(n) };
  },
  maxWidth: function (n: number) {
    return { maxWidth: pTd(n) };
  },
} as const;
