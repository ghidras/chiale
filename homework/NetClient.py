#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import socket
import threading
from time import time

LOOP = '127.0.0.1'
ADDRESS = '10.131.250.51'
PORT = 9999
BUF_SIZE: int = 1024

SOCKET = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
LOCAL_CURRENT = None
LOCAL_CURRENT_MEMBER = []  # [NAME1,NAME2,...]
LOCAL_CORNER = []  # [(NAME,USER,LANGUAGE),...]
SENT_TIME = None

MEDIUM_BLANK = 25 * ' '
WIDE_BLANK = 30 * ' '


# 发送消息到服务器
def sending(message):
    data = message.encode('utf-8')
    SOCKET.sendto(data, (ADDRESS, PORT))


# 在本地查找外语角
def find_corner(corner_name):
    corner_name = corner_name.lower()
    for corner in LOCAL_CORNER:
        if corner[0].lower() == corner_name:
            return corner
    return None


'''
此处负责处理收到的指令
'''


# C   CORNER     USER    LANGUAGE  # 注册成功
def n_append_corner(corner_name, user_name, language):
    global LOCAL_CORNER
    new_corner = (corner_name, user_name, language)
    LOCAL_CORNER.append(new_corner)
    print('成功加入：[' + language + ']' + corner_name)


# c   CORNER                       # 进入成功
def n_set_current(corner_name):
    global LOCAL_CURRENT
    corner_name = corner_name.lower()
    for corner in LOCAL_CORNER:
        if corner[0].lower() == corner_name:
            LOCAL_CURRENT = corner
            print('当前处于：[' + corner[2] + ']' + corner[0] + ' 用户名：' + corner[1])
            return
    print('要设置的外语角不位于所属的组')


# L   CORNER                       # 注销成功
def n_remove_corner(corner_name):
    global LOCAL_CORNER
    global LOCAL_CURRENT
    global LOCAL_CURRENT_MEMBER
    for corner in LOCAL_CORNER:
        if corner[0] == corner_name:
            print('退出群组：' + corner_name)
            LOCAL_CORNER.remove(corner)
            break
    if LOCAL_CURRENT is not None and LOCAL_CURRENT[0] == corner_name:
        LOCAL_CURRENT = None
        LOCAL_CURRENT_MEMBER = []


# l                                # 离开成功，清空CURRENT, CURRENT_MEMBER
def n_reset_current():
    global LOCAL_CURRENT
    global LOCAL_CURRENT_MEMBER
    LOCAL_CURRENT = None
    LOCAL_CURRENT_MEMBER = []
    print('当前不处于外语角')


# +   MEMBER                       # 新增 CURRENT_MEMBER
def n_append_member(member_name):
    global LOCAL_CURRENT_MEMBER
    print(MEDIUM_BLANK + '[' + member_name + ' has joined ' + LOCAL_CURRENT[0] + ']')
    LOCAL_CURRENT_MEMBER.append(member_name)


# -   MEMBER                       # 删除 CURRENT_MEMBER
def n_remove_member(member_name):
    global LOCAL_CURRENT_MEMBER
    print(MEDIUM_BLANK + '[' + member_name + ' has left ' + LOCAL_CURRENT[0] + ']')
    LOCAL_CURRENT_MEMBER.remove(member_name)


# =   MEMBER_LIST                  # 设置 CURRENT_MEMBER
def n_set_member(member_list):
    # 用户列表向用户更新后需要向用户显示
    global LOCAL_CURRENT_MEMBER
    LOCAL_CURRENT_MEMBER = member_list.split()


# T   SERVER_TIME                  # 返回服务器的时间
def n_time_calc(server_time):
    # 一个小测试，测试一个普通报文需要多久才能收到
    present = time()
    server_time = float(server_time)
    print('1:', SENT_TIME)
    print('2:', server_time)
    print('3:', present)
    if SENT_TIME is not None:
        go_time = server_time - SENT_TIME
        print('CLIENT--->%0.6f--->SERVER' % go_time)
    come_time = present - server_time
    print('CLIENT<---%0.6f<---SERVER' % come_time)


class ReceivingThread(threading.Thread):
    # 负责处理收到的报文
    def __init__(self, thread_num=0, timeout=1.0):
        super(ReceivingThread, self).__init__()
        self.thread_num = thread_num
        self.stopped = False
        self.timeout = timeout

    def run(self):
        def receive():
            while True:
                # time.sleep(1)
                buffer = str(SOCKET.recv(BUF_SIZE).decode('utf-8'))
                if buffer == '':
                    continue
                server_command = buffer.split()
                if buffer[0] == 'C':
                    n_append_corner(server_command[1], server_command[2], server_command[3])
                elif buffer[0] == 'L':
                    n_remove_corner(server_command[1])
                elif buffer[0] == 'c':
                    n_set_current(server_command[1])
                elif buffer[0] == 'l':
                    n_reset_current()
                elif buffer[0] == '+':
                    n_append_member(server_command[1])
                elif buffer[0] == '-':
                    n_remove_member(server_command[1])
                elif buffer[0] == '=':
                    n_set_member(buffer[2:])
                elif buffer[0] == 'T':
                    n_time_calc(server_command[1])
                elif buffer[0] == 'r':
                    # 是系统消息，左侧输出
                    print(buffer[2:])
                elif buffer[0] == 'p':
                    # 是用户消息，右侧输出
                    print(WIDE_BLANK + buffer[2:])
                else:
                    print('服务器发送了一个不支持的指令：[', buffer, ']')

        sub_thread = threading.Thread(target=receive, args=())
        sub_thread.setDaemon(True)
        sub_thread.start()
        while not self.stopped:
            sub_thread.join(self.timeout)

    def stop(self):
        self.stopped = True

    def is_stopped(self):
        return self.stopped


thread = ReceivingThread()
thread.start()

'''
本地指令，不需要服务器的交互
'''


# 列出所有支持的指令
def help(user_command):
    if len(user_command) == 1:
        print('支持的指令：')
        for valid in builtin.keys():
            length = 12 - len(valid)
            print(valid + length * ' ', end='')
        print('')
        for valid in builtin_message.keys():
            length = 12 - len(valid)
            print(valid + length * ' ', end='')
        print('')
        for valid in exit_opt.keys():
            length = 12 - len(valid)
            print(valid + length * ' ', end='')
        print('')
        return
    instr = user_command[1]
    for valid in exit_opt:
        if valid == instr:
            print(instr + '可以安全结束这个程序')
            return
    for valid in builtin:
        if valid == instr:
            print(instr + '是一个本地指令')
            return
    for valid in builtin_message:
        if valid == instr:
            print(instr + '是一个需要服务器交互的指令')
            return


# 所有加入的外语角和自己的昵称
def list_corner(user_command):
    for corner in LOCAL_CORNER:
        length = 15 - len(corner[0])
        if LOCAL_CURRENT is not None and corner[0] == LOCAL_CURRENT[0]:
            print('[' + corner[2] + ']' + corner[0] + length * ' ' + '用户名：' + corner[1] + ' <')
        else:
            print('[' + corner[2] + ']' + corner[0] + length * ' ' + '用户名：' + corner[1])


# 当前组的所有人
def list_users(user_command):
    if LOCAL_CURRENT is None:
        print('当前不处于外语角')
        return
    count = 0
    print('当前英语角：' + LOCAL_CURRENT[0])
    print('成员：', end='')
    for member in LOCAL_CURRENT_MEMBER:
        length = 10 - len(member)
        print(member + length * ' ', end='')
        count = count + 1
        if count % 4 == 0:
            print('')
    if count % 4 != 0:
        print('')


'''
此处负责产生发送给服务器的指令。
'''


def message_digest(corner_name, user_command, my_name):
    message = 'M' + ' ' + corner_name + ' '
    message = message + ' '.join(user_command).replace(' ', '_')
    message = message + ' ' + my_name
    return message


# M   CORNER_NAME MESSAGE   [MY_NAME]             # 组内广播
def public_message(user_command):
    if len(user_command) < 2:
        print('参数太少')
        return ''
    corner_name = user_command[1]  # 群组的名字是第一个参数
    my_corner = find_corner(corner_name)
    if my_corner is None:
        print('不存在请求的外语角')
        return ''
    return message_digest(corner_name, user_command[2:], my_corner[1])


# m   DESTIN_NAME MESSAGE   [CURRENT]  [MY_NAME]  # 组内私信
def private_message(user_command):
    global LOCAL_CURRENT
    if len(user_command) < 2:
        print('参数太少')
        return ''
    if LOCAL_CURRENT is None:
        print('你尚未进入任何外语角')
        return ''
    receiver = user_command[0][2:]
    if receiver not in LOCAL_CURRENT_MEMBER:
        print('用户' + receiver + '不存在')
        return ''
    message = 'm' + ' ' + user_command[0][2:]  # user name
    message = message + ' ' + ' '.join(user_command[1:]).replace(' ', '_')  # message
    message = message + ' ' + LOCAL_CURRENT[0] + ' ' + LOCAL_CURRENT[1]  # current corner & name
    return message


# V                                               # 当前所有在线外语角
def list_all_corner(user_command):
    return 'V'


# C   CORNER_NAME MY_NAME   {ADDRESS}             # 注册
def join_corner(user_command):
    if len(user_command) < 3:
        print('参数太少')
        return ''
    corner_name = user_command[1]
    my_corner = find_corner(corner_name)
    if my_corner is not None:
        print('你已经加入过' + corner_name)
        return ''
    message = 'C' + ' ' + corner_name
    message = message + ' ' + user_command[2]  # user name
    return message


# K   CORNER_NAME MY_NAME   {ADDRESS}             # 注册进入(相当于C+c)
def join_and_current(user_command):
    if len(user_command) < 3:
        print('参数太少')
        return ''
    corner_name = user_command[1]
    user_name = user_command[2]
    my_corner = find_corner(corner_name)
    if my_corner is not None:
        print('你已经加入过这个组了')
        if my_corner[1] != user_name:
            user_name = my_corner[1]
            print('你将以之前的用户名：' + user_name + '加入改组')
        message = 'c' + ' ' + corner_name
        message = message + ' ' + user_name
        return message
    message = 'K' + ' ' + corner_name  # corner name
    message = message + ' ' + user_name  # user name
    return message


# c   CORNER_NAME [MY_NAME] {ADDRESS}             # 进入
def set_current_corner(user_command):
    if len(user_command) < 2:
        print('参数太少')
        return ''
    global LOCAL_CORNER
    for corner in LOCAL_CORNER:
        if corner[0].lower() == user_command[1].lower():
            message = 'c' + ' ' + corner[0] + ' ' + corner[1]  # corner and name
            return message
    print('尚未加入' + user_command[1])
    return ''


# l   CORNER_NAME [MY_NAME]                       # 离开
def leave_current(user_command):
    global LOCAL_CURRENT
    if LOCAL_CURRENT is None:
        print('当前没有进入外语角')
        return ''
    message = 'l' + ' ' + LOCAL_CURRENT[0] + ' ' + LOCAL_CURRENT[1]
    return message


# L   CORNER_NAME [MY_NAME] {ADDRESS}             # 注销
def leave_corner(user_command):
    if len(user_command) < 2:
        print('参数太少')
        return ''
    my_corner = find_corner(user_command[1])
    if my_corner is None:
        print('不存在请求的外语角')
        return ''
    message = 'L' + ' ' + 'u' + ' ' + user_command[1]
    return message


# T                                               # 时间测试
def time_test(user_command):
    global SENT_TIME
    SENT_TIME = time()
    return 'T'


# E   {ADDRESS}                                   # 退出软件
def quit_query():
    sending('E')


builtin = {'/help': help,
           '/in': list_corner,
           '/list': list_corner,
           '/listusers': list_users,
           }
builtin_message = {'/public': public_message,
                   '/current': set_current_corner,
                   '/enter': join_and_current,
                   '/leave': leave_current,
                   '/msg': public_message,
                   '/join': join_corner,
                   '/corners': list_all_corner,
                   '/corner': list_all_corner,
                   '/logout': leave_corner,
                   '/time': time_test,
                   }
exit_opt = {'/exit': quit_query,
            '/bye': quit_query,
            }
while True:
    data_raw = input().strip()

    if data_raw == '':
        continue
    if data_raw[0] == '/':
        instruction = data_raw.split()
        command = instruction[0].lower()
        if command[1] == '@':
            # 私信的标识
            data_raw = private_message(instruction)
        elif command in builtin_message:
            # 内置函数
            data_raw = builtin_message[command](instruction)
        elif command in builtin:
            # 不和服务器交互的指令
            builtin[command](instruction)
            continue
        elif command in exit_opt:
            # 需要退出
            exit_opt[command]()
            break
        else:
            print('本地尚未支持指令：' + command)
    elif LOCAL_CURRENT is not None:
        # 通过这里可以直接发送消息
        data_raw = message_digest(LOCAL_CURRENT[0], data_raw.split(), LOCAL_CURRENT[1])
    else:
        print('你尚未加入外语角')
        list_all_corner('')
        continue
    if data_raw != '':
        # 发送报文给服务器
        sending(data_raw)

thread.stop()
thread.join()
