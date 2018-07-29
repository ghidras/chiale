#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import threading
from time import time
from NetClass import *

# 关于网络的一些全局变量
LOOP = '127.0.0.1'
ADDRESS = get_ip()
PORT = 9999
BUF_SIZE = 2048

# 管理员的一些信息
ADMIN_CURRENT = None  # 管理员当前所在的外语角
ADMIN_VERBOSE = False  # 是否展示详细的信息

SERVER_SOCKET.bind((ADDRESS, PORT))
print('运行于 ' + ADDRESS + ':' + str(PORT))

'''
此处负责处理收到的指令，并负责产生指令发送给客户端
'''


# M   CORNER_NAME MESSAGE   [MY_NAME]             # 组内广播
def public_message(corner_name, message, name):
    # 默认成功发送不会返回信息
    # 去掉注释会返回成功的指示
    message = message.replace('_', ' ')
    if ADMIN_CURRENT is not None and corner_name == ADMIN_CURRENT.get_name():
        print(name, ':', message)
    my_corner = cornerTable.find_corner(corner_name)
    length = 10 - len(name)
    if length < 0:
        length = 0
    message = 'p' + ' ' + length * ' ' + name + ':' + message
    my_corner.broadcast(message, name)
    # return 'r' + ' ' + '√'
    return ''


# m   DESTIN_NAME MESSAGE   [CURRENT]  [MY_NAME]  # 组内私信
def private_message(receiver_name, message, corner, name):
    # 默认成功发送不会返回信息
    # 去掉注释会返回成功的指示
    receiver = cornerTable.has_member_by_name(receiver_name)
    if receiver is None:
        return 'r 你请求的用户不存在'
    if receiver[0].get_name() != corner:
        return 'r 你们不在同一个组内'
    if receiver[1].get_name() == name:
        return 'r 无需私信自己'
    receiver_address = receiver[1].get_address()
    length = 9 - len(name)
    if length < 0:
        length = 0
    message = 'p' + ' ' + length * ' ' + '@' + name + ':' + message.replace('_', ' ')
    SERVER_SOCKET.sendto(message.encode('utf-8'), receiver_address)
    # return 'r √ ' + receiver_name
    return ''


# K
def join_and_current(corner, name, address):
    join_message = join_corner(corner, name, address)
    SERVER_SOCKET.sendto(join_message.encode('utf-8'), address)
    if join_message[0] == 'C':
        # 如果join成功的话，按照报文格式第一个字符应该为C。
        # 如果不成功，则无需设为current
        return set_current(corner, name, address)
    return ''  # 返回空串，实际上不会发送


# C   CORNER_NAME MY_NAME   {ADDRESS}             # 注册
def join_corner(corner, name, address):
    my_corner = cornerTable.find_corner(corner)
    if my_corner is None:
        return 'r 不存在请求的外语角\n' + list_corners()
    if my_corner.find_member_by_name(name) is not None:
        return 'r 已经有同名用户\n当前用户列表：' + my_corner.list_member_plain()
    if my_corner.find_member_by_address(address) is not None:
        return 'r 已经有同地址同端口号用户'
    new_member = Member(name)
    new_member.set_address(address)
    my_corner.append_member(new_member)
    # 更新这个组中Current的成员的列表
    message = '+' + ' ' + name
    my_corner.broadcast_in_current(message, name)
    return 'C' + ' ' + my_corner.get_name() + ' ' + name + ' ' + my_corner.get_lang()


# c CORNER_NAME [MY_NAME] # set as current corner
def set_current(corner, name, address):
    my_corner = cornerTable.find_corner(corner)
    my_corner.append_current(name)
    # 更新自己的列表
    message = '=' + ' ' + my_corner.list_member_plain()
    SERVER_SOCKET.sendto(message.encode('utf-8'), address)
    return 'c' + ' ' + corner


# L   CORNER_NAME [MY_NAME] {ADDRESS}             # 注销
def leave_corner(corner, name, address):
    my_corner = cornerTable.find_corner(corner)
    if my_corner is None:
        return 'L' + ' ' + corner
    my_corner.remove_member(name)
    if my_corner.remove_current(name) is True:
        # current 域也应该更新
        another_reply = 'l' + ' ' + corner
        SERVER_SOCKET.sendto(another_reply.encode('utf-8'), address)
    # 更新他人的列表
    message = '-' + ' ' + name
    my_corner.broadcast_in_current(message, name)
    return 'L' + ' ' + corner


# l   CORNER_NAME [MY_NAME]                       # 离开
def leave_current(corner, name):
    my_corner = cornerTable.find_corner(corner)
    if my_corner.remove_current(name) is True:
        return 'l' + ' ' + corner


# E   {ADDRESS}                                   # 退出软件
def bye(address):
    cornerTable.remove_member_by_address(address)
    return 'p 再见'


# V                                               # 当前所有在线外语角
def list_corners():
    ret = 'r 外语角列表'
    list_string = cornerTable.list_corner()
    if list_string is None:
        return ret + '\n' + '<NULL>'
    else:
        return ret + list_string


# A                                               # 关于
def about():
    return 'r' + ' ' + ABOUT_STRING


# 收发报文的进程
class ServiceThread(threading.Thread):

    def __init__(self, thread_num=0, timeout=1.0):
        super(ServiceThread, self).__init__()
        self.thread_num = thread_num
        self.stopped = False
        self.timeout = timeout

    def run(self):
        def service_loop():
            while True:
                data_raw, address = SERVER_SOCKET.recvfrom(BUF_SIZE)
                data = data_raw.decode('utf-8')
                opt = data[0]
                # 获取每一个参数
                command = data.strip().split()
                # 如果时 VERBOSE 模式，则显示详细信息
                if ADMIN_VERBOSE is True:
                    print('%s:%s' % address, end='')
                    print(command)

                # 根据类型来进行不同的调用，得到不同的返回报文，返回报文为空串则不返回
                if opt == 'M':
                    reply = public_message(command[1], command[2], command[3])
                elif opt == 'm':
                    reply = private_message(command[1], command[2], command[3], command[4])
                elif opt == 'K':
                    reply = join_and_current(command[1], command[2], address)
                elif opt == 'C':
                    reply = join_corner(command[1], command[2], address)
                elif opt == 'c':
                    reply = set_current(command[1], command[2], address)
                elif opt == 'L':
                    reply = leave_corner(command[1], command[2], address)
                elif opt == 'l':
                    reply = leave_current(command[1], command[2])
                elif opt == 'E':
                    reply = bye(address)
                elif opt == 'V':
                    reply = list_corners()
                elif opt == 'A':
                    reply = about()
                elif opt == 'T':
                    reply = 'T' + ' ' + str(time())
                else:
                    print('收到一个不支持的指令：', data)
                    continue
                if reply == '':
                    # reply 为空串则不发送消息
                    continue
                SERVER_SOCKET.sendto(reply.encode('utf-8'), address)

        sub_thread = threading.Thread(target=service_loop, args=())
        sub_thread.setDaemon(True)
        sub_thread.start()
        while not self.stopped:
            sub_thread.join(self.timeout)

    def stop(self):
        self.stopped = True

    def is_stop(self):
        return self.stopped


# 为父进程调用的一些程序
# 以 m_ 开头，只用于管理员的管理
def m_list_corners():
    print('外语角列表', end='')
    list_string = cornerTable.list_corner()
    if list_string is None:
        print('<NULL>')
    else:
        print(list_string)


# 增加外语角
def m_open_corner(corner_name, corner_lang):
    cornerTable.append_corner(corner_name, corner_lang)
    # 添加完成后展示列表
    m_list_corners()


# 关闭外语角
def m_close_corner(corner_name):
    global ADMIN_CURRENT
    if cornerTable.remove_corner(corner_name) is True:
        # 删除的时候可能是当前所在的组
        if ADMIN_CURRENT.get_name() == corner_name:
            ADMIN_CURRENT = None
        print('成功删除')
    else:
        print('查无此角')
    m_list_corners()


# 退出程序
def m_exit():
    opt = input('确认退出？(Y/N)')
    ret = opt == 'Y' or opt == 'y'
    if ret is True:
        # 解散所有的组，所有的人都会退出
        cornerTable.remove_all()
    return ret


# 进入到某个外语角
def m_enter(corner_name):
    global ADMIN_CURRENT
    corner = cornerTable.find_corner(corner_name)
    if corner is None:
        print('查无此角')
    else:
        ADMIN_CURRENT = corner
        print('当前外语角：', corner.get_name())


# 展示外语角中所有的用户
def m_list_users():
    if ADMIN_CURRENT is None:
        print('当前不处于外语角')
    else:
        print('成员列表')
        print(ADMIN_CURRENT.list_member())


# 把用户从当前组移除
def m_kick(name):
    if ADMIN_CURRENT is None:
        print('当前不处于外语角')
        return
    member = ADMIN_CURRENT.find_member_by_name(name)
    if member is None:
        print('不存在这个用户')
        return
    if ADMIN_CURRENT.remove_member(name) is False:
        print('未成功移除')
        return
    message = 'L' + ' ' + ADMIN_CURRENT.get_name()
    address = member.get_address()
    SERVER_SOCKET.sendto(message.encode('utf-8'), address)
    message = '-' + ' ' + name
    ADMIN_CURRENT.broadcast(message, name)
    print('成功移除')


# 会显示所有报文的来源和信息，方便调试
def m_verbose():
    global ADMIN_VERBOSE
    ADMIN_VERBOSE = True
    print('已经进入 VERBOSE 模式')


def m_coarse():
    global ADMIN_VERBOSE
    ADMIN_VERBOSE = False
    print('已经进入 COARSE 模式')


# 退出监听的外语角
def m_leave():
    global ADMIN_CURRENT
    ADMIN_CURRENT = None
    print('已经成功退出')


# 展示所有可执行的外语角
def m_help():
    tag = '   '
    print('使用说明')
    count = 0
    for valid in m_builtin_0_arg.keys():
        print(tag, valid, end='')
        count = count + 1
        if count % 4 == 0:
            print('')
    if count % 4 != 0:
        print('')
    for valid in m_builtin_1_arg.keys():
        print(tag, valid, '[ARG1]...')
    for valid in m_builtin_2_arg.keys():
        print(tag, valid, '[ARG1]... [ARG2]...')
    for valid in m_exit_opt.keys():
        print(tag, valid)


# 关于信息
def m_about():
    print(ABOUT_STRING)


# 输入到函数的映射表，方便支持更多的输入
# 不需要参数的函数
m_builtin_0_arg = {'/list': m_list_corners,
                   '/corners': m_list_corners,
                   '/users': m_list_users,
                   '/listcorners': m_list_corners,
                   '/listusers': m_list_users,
                   '/leave': m_leave,
                   '/help': m_help,
                   '/about': m_about,
                   '/verbose': m_verbose,
                   '/coarse': m_coarse,
                   '/silent': m_coarse,
                   }
# 一个参数的函数
m_builtin_1_arg = {'/closecorner': m_close_corner,
                   '/enter': m_enter,
                   '/kickout': m_kick,
                   }
# 两个参数的函数
m_builtin_2_arg = {'/opencorner': m_open_corner,
                   '/open': m_open_corner
                   }
# 退出函数
m_exit_opt = {'/exit': m_exit}

# 启用处理报文的线程
thread = ServiceThread()
thread.start()

while True:
    m_data = input().strip()  # 去除空白符
    if m_data == '':  # 考虑空白输入
        continue

    m_command = m_data.split()
    m_command[0] = m_command[0].lower()  # 指令符忽略大小写

    # 输入不含参数的指令
    if m_command[0] in m_builtin_0_arg:
        m_builtin_0_arg[m_command[0]]()
    # 输入一个参数的指令
    elif m_command[0] in m_builtin_1_arg:
        if len(m_command) <= 1:
            print('参数太少')
            continue
        m_builtin_1_arg[m_command[0]](m_command[1])
    elif m_command[0] in m_builtin_2_arg:
        if len(m_command) <= 2:
            print('参数太少')
            continue
        m_builtin_2_arg[m_command[0]](m_command[1], m_command[2])
    # 输入退出的指令
    elif m_command[0] in m_exit_opt:
        result = m_exit_opt[m_command[0]]()
        if result is True:
            break
        else:
            continue
    # 不合法输入
    else:
        print('当前不支持指令：' + m_command[0])

thread.stop()
thread.join()
