import React, { useEffect, useState, useRef, useCallback } from "react";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import Helper from "shared/helper";
import { GetAppointmentsMulti, GetChatMessages, GetChatTargets, GetDocumentSingleMedia, GetStatus, MarkRead, SendChatMessage } from "shared/services";
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import { ImageNotSupported as ImageNotSupportedIcon } from '@mui/icons-material';
import InfoIcon from '@mui/icons-material/Info';
import { Avatar } from "@mui/material";
import { SearchInput, SearchInput1, Text, TooltipBanner } from "components";
import Session from "shared/session";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const formatMessageTime = (dateStr) => {
  const date = dayjs(dateStr);
  const now = dayjs();

  if (date.isSame(now, "day"))  return date.format("HH:mm");
  else if (date.isSame(now.subtract(1, "day"), "day")) return `Yesterday ${date.format("HH:mm")}`;
  else return date.format("DD MMM YYYY, HH:mm");
};

const ChatWindow = ({ chats, onClose, messages, setMessages, senderDp, receiverDp  }) => {
    const [input, setInput] = useState("");
    const [initialize, setInitialize] = useState(false);
    const [textRow, setTextRow] = useState(1);
    const [files, setFiles] = useState([]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
       scrollToBottom();
    }, [messages]);

    const LoadData = async () => {

        let query = null, id, filters = [], expands = '';

        global.Busy(true);

        filters = [`targetEmail=${chats.Email}`, "limit=20", `before=${new Date().toISOString()}`];

        if (!Helper.IsJSONEmpty(filters)) {
            query = filters.join("&");
        }

        let _rows = [];
        await GetChatMessages(query, expands)
            .then(async (res) => {
                if (res.status) {
                    _rows = Helper.sortByField(res.values, "sentAt", "asc");
                    // await Promise.all(
                    //     _rows
                    //     .filter(r => !r.read && r.sender === chats.Email)
                    //     .map(r => {
                    //         const data = { messageId: r.id };
                    //         return MarkRead(data);
                    //     })
                    // );
                } else {
                    console.log(res.statusText);
                }
            });

        setMessages(_rows);
        global.Busy(false);
    }

    if (initialize) { setInitialize(false); LoadData(); }
    useEffect(() => { setInitialize(true); }, [chats.Email]);

    const OnClose = () => {
        if(onClose) onClose()
    }

    const OnInputChange = (e) => {
        const { name, value } = e.target;
        const textareaLineHeight = 23;
        const { scrollHeight } = e.target;

        const currentRow = Math.floor(scrollHeight / textareaLineHeight);

        if (currentRow >= 3) {
            setTextRow(3);
        } else {
            setTextRow(currentRow);
        }
        setInput(value);
    }
    

    const OnSubmit = async () => {
        let data, rslt;

        if(!input) return;

        data = {
            receiverEmail: chats.Email,
            message: input,
            receiverId: chats.DoctorId,
            receiverType: "Dcotor"
        }
        setInput('');

        rslt = await SendChatMessage(data);

        if (!rslt.status) {
            global.AlertPopup("error", "Failed to send message" )
            return;
        }
    }

    const onUploadFile = (e) => {
        const newFile = e.target.files?.[0]; 
            if (newFile && !files.some(file => file.name === newFile.name)) {
            setFiles(prev => [...prev, newFile]); 
        }
    }

    const onRemoveFile = (file) => {
        setFiles(prev => prev.filter(x => x.name !== file.name));
    }

    return(
         <div key={chats.id} className="w-[520px] h-[100%] bg-[#fff] shadow-xl border border-[#624DE3] rounded-lg flex flex-col">
            <div className="flex items-center justify-between p-2 border-b">
                <div className="flex items-center gap-2">
                        <div className="relative inline-block">
                            <Avatar
                                variant="square"
                                src={receiverDp}
                                alt={chats.FullName}
                                sx={{ width: 34, height: 34, borderRadius: 2 }}
                            >
                                <AccountCircleTwoToneIcon />
                            </Avatar>

                            <span
                                className={`absolute bottom-0 right-0 block w-2 h-2 rounded-full ring-2 ring-[#fff] ${
                                chats?.status?.isOnline ? "bg-green-500" : "bg-gray-400"
                                }`}
                            ></span>
                        </div>
                    <div className="flex gap-1">
                        <Text variant="p" className="text-sm font-semibold text-black-900">{chats.FullName}</Text>
                        <span className="ml-1 text-sm text-gray-500">{chats?.status?.isOnline ? '• Online' : '• Offline'} </span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <TooltipBanner
                        icon={<InfoIcon />}
                        content="This chat window will close in 3 days. To continue to communicate with your chatstor you can book another appointment."
                        severity="warning"
                        sx={{ backgroundColor: "#f7c788", width: '450px' }}
                    />   
                    <CloseIcon fontSize="medium" className="cursor-pointer" color="secondary" onClick={() => OnClose()} />
                </div>
            </div>

            <div className="flex-1 p-3 space-y-2 overflow-y-auto text-sm gap-2">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex gap-2 justify-start`}
                    >   
                        <Avatar 
                            variant="square" 
                            src={msg.sender === chats.Email ? receiverDp : senderDp } 
                            alt={chats.FullName}
                            sx={{ width: 40, height: 40, borderRadius: 2 }}
                        >
                            <AccountCircleTwoToneIcon />
                        </Avatar>
                        <div
                            className={`rounded-lg max-w-[90%] text-gray-900`}
                        >
                            <Text variant="p" className="text-sm font-semibold text-black-900 pb-1">
                                {msg.sender === chats.Email ? chats.FullName : 'You' }

                                <span className="text-xs text-gray-500">
                                   &nbsp;•&nbsp;{formatMessageTime(msg.sentAt)}
                                </span>
                            </Text>
                            <Text variant="p" className="text-sm text-[#000000CC] pb-1">{msg.message}</Text>

                            {msg.file && (
                                <div className="mt-1 bg-white text-gray-800 border rounded-md px-2 py-1 text-xs flex items-center gap-2">
                                📄 {msg.file}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-3 flex flex-col justify-between border-t gap-2">
               <textarea
                    id="chat"
                    rows={textRow}
                    className={`flex-1 border-none rounded-lg px-3 py-1 text-sm focus:outline-none text-black-900 resize-none block w-[100%] h-full leading-6`}
                    placeholder="Send a message..."
                    name="chat"
                    onChange={OnInputChange}
                    value={input}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            OnSubmit();
                        }
                    }}
               /> 

                <div className="flex justify-between">
                    <AttachFileIcon fontSize="small" className="w-6 h-6 text-gray-500 cursor-pointer" />
                    <SendIcon fontSize="small" className={`${input ? 'text-blue-600' : 'text-gray-600'} w-6 h-6 cursor-pointer`} onClick={OnSubmit} />
                </div>
            </div>
        </div>
    )
}

const Component = ({ Id, showItem, updateBatchCounts, onActionClicked }) => {
    const [chats, setChats] = useState({});
    const [initialize, setInitialize] = useState(false);
    const [rows, setRows] = useState([]);
    const [targets, setTargets] = useState([]);
    const [searchStr, setSearchStr] = useState("");
    const [profilePictures, setProfilePictures] = useState([]);
    const [messages, setMessages] = useState([]);
   
    const LoadData = async () => {
        let query = null, filters = [], expands = 'BookedBy,ConsultedDoctor';
        setRows([]);

        global.Busy(true);

        filters.push(`$filter=AppointmentBookedBy eq ${parseInt(Id)}`);

        if (!Helper.IsJSONEmpty(filters)) {
            query = filters.join("&");
        }

        let _rows = [], _targets = [];
        await GetAppointmentsMulti(query, expands)
            .then(async (res) => {
                if (res.status) {
                     _rows = res.values.reduce((acc,e) => {
                        const receiver = acc.find(x => x['ConsultedDoctor']['DoctorId'] === e['ConsultedDoctor']['DoctorId']);
                        if(Helper.IsJSONEmpty(receiver)) return [...acc, e];

                        return acc;
                     }, []);

                     const res1 = await GetChatTargets();
                     if(res1.status) {
                        _targets = res1.values;
                        const unreadCount = _targets.reduce((acc, v) => acc + (v.unreadCount || 0), 0);
                        updateBatchCounts('chat', unreadCount);

                        fetchDps(_rows.at(0)?.BookedBy, _rows);

                        const emails = _rows.map(r => r.ConsultedDoctor.Email);
                        const res2 = await GetStatus({emails});
                        if(res2.status) _rows.forEach(r => {
                            r['status'] = res2.values[r.ConsultedDoctor.Email]
                        });
                    }
                } else {
                    console.log(res.statusText);
                }
            });
         
        setTargets(_targets);
        setRows(_rows);
        global.Busy(false);
    }

    const fetchDps = async (dpSingle, rows) => {
        let pictureIds = [];

        pictureIds = rows
            .filter(x => x.ConsultedDoctor.DoctorDoctorImage)
            .map(r => ({ email: r.ConsultedDoctor.Email, id: r.ConsultedDoctor.DoctorDoctorImage }));

        pictureIds.push({email: dpSingle.Email, id: dpSingle.PatientProfilePicture});

        const results = await Promise.all(
            pictureIds.map(({ email, id }) =>
                GetDocumentSingleMedia(id, true).then(res => ({ key: email, value: res.values }))
            )
        );
        setProfilePictures(results);
    }

    if (initialize) { setInitialize(false); LoadData(); }
    useEffect(() => { setInitialize(true); }, []);

    const openChat = async (ConsultedDoctor, BookedBy) => {
        setMessages([]);
        
        global.Busy(true); 
          const status = await fetchStatus();
        global.Busy(false);
            
        setChats({...ConsultedDoctor, status: status[ConsultedDoctor.Email], BookedBy });
    };

    const closeChat = () => {
        setChats({});
    };

    const OnSearchChanged = (e) => { setSearchStr(e); }

    useEffect(() => {
        if (!rows) return;

        const token = Session.Retrieve("jwtToken");
        if (!token) return;

        const url = `wss://9jhhrk3mob.execute-api.ap-south-1.amazonaws.com/prod?token=${token}`;
        const socket = new WebSocket(url);

        socket.onopen = () => {
            const _rows = rows.map(r => r['BookedBy']['Email']);
            socket.send(
              JSON.stringify({ type: "subscribe", targetEmail: _rows })
            );

            console.log("✅ WebSocket connected");
        };

        socket.onmessage = async (event) => {
            try {
                const msg = JSON.parse(event.data);

                let isTargetFetched = false;
                if (msg.sender) {
                    if (msg.sender === chats.Email || msg.receiver === chats.Email) {
                        isTargetFetched = true;
                        fetchTargets(msg);
                        setMessages((prev) => [...prev, msg]);
                    } 
                    if(!isTargetFetched) fetchTargets();
                }

                fetchStatus();
            } catch (err) {
                console.error("❌ Invalid WS message", err);
            }
        };

        socket.onclose = () => {
            console.log("❌ WebSocket disconnected");
        };

        return () => {
            socket.close();
        };
    }, [rows, chats.Email]);

    const formatTargetData = (email) => {
        const target = targets.find(t => t.user === email);

        if (!target) return { LastMessageAt: "", UnreadCount: null, LastMessage: "" };

        const date = new Date(target.lastMessageAt);
        const now = new Date();
        let LastMessageAt = "";

        const diffMs = now - date;
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        if(diffMinutes <= 0) LastMessageAt = `Now`;
        else if (diffMinutes < 60) {
            LastMessageAt = `${diffMinutes}m ago`;
        } else if (diffHours < 24) {
            LastMessageAt = date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
        } else {
            LastMessageAt = `${diffDays}d ago`;
        }

        return {
            LastMessageAt,
            UnreadCount: target.unreadCount > 0 ? target.unreadCount : null,
            LastMessage: target.lastMessage,
        };
    };

    useEffect(() => {
        if (!searchStr) { setInitialize(true); return; }

        const _rows = rows.filter(r =>
            r.ConsultedDoctor?.FullName?.toLowerCase().includes(searchStr.toLowerCase())
        );

        setRows(_rows);
    }, [searchStr])
    
    const OnActionClicked = (e) => {
        setChats({});
        if(onActionClicked) onActionClicked(e);
    }

    const fetchTargets = async (message) => {
        if(!Helper.IsJSONEmpty(chats) && !Helper.IsJSONEmpty(message)) {
            if(message.sender === chats.Email) await MarkRead({ messageId : message.id });          
        }

        const res = await GetChatTargets();
        if(res.status) {
            const _targets = res.values;
            setTargets(_targets);
            const unreadCount = _targets.reduce((acc, v) => acc + (v.unreadCount || 0), 0);
            updateBatchCounts('chat', unreadCount);
        }
    }

    const fetchStatus = async () => {
        if(rows.length) {
            const _rows = rows;
            const emails = rows.map(r => r.ConsultedDoctor.Email);
            const res2 = await GetStatus({emails});
    
            if(res2.status) _rows.forEach(r => {
                r['status'] = res2.values[r.ConsultedDoctor.Email]
            });
            setRows(rows);
    
            return res2.values;
        }
    }

    useEffect(() => {
        fetchTargets()
    }, [messages])

    const isChatAvailable = !Helper.IsJSONEmpty(chats);

    const receiverDp = isChatAvailable ? profilePictures?.find(x => x.key === chats.Email)?.value : null;
    const senderDp = isChatAvailable ? profilePictures?.find(x => x.key === chats.BookedBy.Email)?.value : null;

    if(showItem !== "Chat") return null;

  return (
    <div className="bg-white flex fixed top-24 right-0 p-4 gap-4 h-[80%]">   

        {isChatAvailable && <ChatWindow chats={chats} onClose={closeChat} targets={targets} messages={messages} setMessages={e => setMessages(e)}
          receiverDp={receiverDp} senderDp={senderDp} />}

        <div className="bg-[#fff] shadow-xl rounded-lg overflow-hidden w-80 border border-[#9E9E9E]">
            <div className="flex items-center justify-between p-3 border-b border-[#9E9E9E]  color-[#000">
                <span className="font-semibold text-black-900">Messages</span>
                <div className="flex items-center gap-2">
                    <SearchInput1 searchStr={searchStr} onSearchChanged={OnSearchChanged} />
                    <CloseIcon fontSize="medium" className="cursor-pointer" color="secondary" onClick={() => OnActionClicked("Chat")} />
                </div>
            </div>
            <div className="divide-y max-h-96 overflow-y-auto">
                {rows.map(({ConsultedDoctor, status, BookedBy, ...chats}) => {
                    const { LastMessageAt, UnreadCount, LastMessage } = formatTargetData(ConsultedDoctor.Email);
                    const receiverDp = profilePictures.find(x => x.key === ConsultedDoctor.Email)?.value;

                    return (
                        <div
                            key={chats.id}
                            className={`flex items-start px-2 py-4 border-b cursor-pointer hover:bg-gray-100 ${chats?.Email === ConsultedDoctor.Email && 'bg-gray-100'}`}
                            onClick={() => openChat(ConsultedDoctor, BookedBy)}
                        >
                            <div className="relative inline-block">
                                <Avatar 
                                    variant="square"
                                    src={receiverDp} 
                                    alt={ConsultedDoctor.FullName}
                                    sx={{ width: 40, height: 40, borderRadius: 2 }}
                                >
                                   <AccountCircleTwoToneIcon />
                                </Avatar>
                                <span
                                    className={`absolute bottom-0 right-0 block w-2 h-2 rounded-full ring-2 ring-[#fff] ${
                                    status?.isOnline ? "bg-green-500" : "bg-gray-400"
                                    }`}
                                ></span>
                            </div>
                            <div className="ml-3 flex-1 w-[200px]">
                                <div className="flex justify-between">
                                    <Text variant="p" className="text-sm font-semibold text-black-900 pb-1">{ConsultedDoctor.FullName}</Text>
                                    {LastMessageAt && <Text variant="p" className="text-sm text-[#000000CC] pb-1">{LastMessageAt}</Text>}
                                </div>
                                    <div className="flex justify-between">
                                        {LastMessage && (
                                            <Text variant="p" className="text-sm text-[#000000CC] pb-1 truncate w-[80%]">
                                                {LastMessage}
                                            </Text>
                                        )}
                                        {UnreadCount && (
                                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#635BFF] text-white text-xs">
                                                {UnreadCount}
                                            </span>
                                        )}
                                    </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    </div>
  );
}

export default Component;