import socket

SERVER_SOCKET = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)


class Member(object):
    # 关于成员的类

    def __init__(self, name):
        self.name = name
        self.address = None

    def get_name(self):
        return self.name

    def get_address(self):
        return self.address

    def set_address(self, address):
        # 这里address 是形如 ('127.0.0.1',9999) 的 tuple
        self.address = address

    def unset_address(self):
        self.address = None


class Corner(object):

    def __init__(self, name, lang):
        # name 记录区分大小写，识别不区分大小写
        # lang 所有字母大写
        # member 有输出功能，输入的时候实现排序
        # current 主要用于查找
        self.name = name
        self.lang = lang.upper()
        self.member = []  # Member 的列表
        self.current = []  # name 的列表

    def get_name(self):
        return self.name

    def get_lang(self):
        return self.lang

    def append_member(self, new_member):  # 需要传一个 Member 类型过来
        name = new_member.get_name()
        address = new_member.get_address()
        if self.find_member_by_name(name) is not None:
            return False
        if self.find_member_by_address(address) is not None:
            return False
        self.member.append(new_member)
        self.member.sort(key=lambda x: x.get_name())  # 按照名字排序
        return True

    def remove_member(self, name):
        member = self.find_member_by_name(name)
        if member is None:
            return False
        self.member.remove(member)
        return True

    def remove_member_by_address(self, address):
        member = self.find_member_by_address(address)
        if member is None:
            return
        name = member.get_name()
        message = '-' + ' ' + name
        self.broadcast(message, name)
        self.member.remove(member)
        return

    def append_current(self, name):
        member = self.find_member_by_name(name)
        if member is None:
            return False
        self.current.append(name)
        return True

    def remove_current(self, name):
        member = self.find_member_by_name(name)
        if member is None:
            return False
        self.current.remove(name)
        return True

    def list_member(self):
        # 面向用户和管理员进行输出
        list_string = ' <' + self.name + '>'
        if len(self.member) == 0:
            return list_string + '\n<NULL>'
        for member in self.member:
            list_string = list_string + '\n' + member.get_name()
        return list_string

    def list_member_plain(self):
        # 面向客户端，客户端需要进行识别
        list_string = ''
        for member in self.member:
            list_string = list_string + ' ' + member.get_name()
        return list_string

    def find_member_by_name(self, name):
        for member in self.member:
            if member.get_name() == name:
                return member
        return None

    def find_member_by_address(self, address):
        for member in self.member:
            if member.get_address() == address:
                return member
        return None

    def broadcast(self, message, sender):
        # 对 message 直接传输，使用小组广播时需要自己装配好 message
        # sender 为 None 时实现对所有人进行小组广播
        for member in self.member:
            if member.get_name() != sender:
                SERVER_SOCKET.sendto(message.encode('utf-8'), member.get_address())

    def broadcast_in_current(self, message, sender):
        if len(self.current) == 0:
            return
        for member in self.member:
            member_name = member.get_name()
            if member_name != sender and member_name in self.current:
                SERVER_SOCKET.sendto(message.encode('utf-8'), member.get_address())


class CornerTable(object):
    # 大部分的接口只开放给管理员

    def __init__(self):
        self.table = []

    def find_corner(self, name):
        name = name.lower()
        for corner in self.table:
            if corner.name.lower() == name:
                return corner
        return None

    def append_corner(self, name, lang):
        if self.find_corner(name) is not None:
            return False
        new_corner = Corner(name, lang)
        self.table.append(new_corner)
        self.table.sort(key=lambda x: x.lang)  # 按照语言排序
        return True

    def remove_corner(self, name):
        corner = self.find_corner(name)
        if corner is None:
            return False
        message = 'L' + ' ' + name
        corner.broadcast(message, None)
        self.table.remove(corner)
        return True

    def list_corner(self):
        # 面向用户和管理员输出
        if len(self.table) == 0:
            return None
        list_reply = ''
        for corner in self.table:
            list_reply = list_reply + '\n' + '[' + corner.get_lang() + ']' + corner.get_name()
        return list_reply

    def has_member_by_name(self, name):
        # 返回(corner,member)
        for corner in self.table:
            ret = corner.find_member_by_name(name)
            if ret is not None:
                return corner, ret
        return None

    def has_member_by_address(self, address):
        # 返回(corner,member)
        for corner in self.table:
            ret = corner.find_member_by_address(address)
            if ret is not None:
                return corner, ret
        return None

    def remove_member_by_address(self, address):
        for corner in self.table:
            corner.remove_member_by_address(address)

    def remove_all(self):
        for corner in self.table:
            self.remove_corner(corner.get_name())


# 所有的外语角信息封装在这个变量里
cornerTable = CornerTable()
# 初始设置的若干个外语角
cornerTable.append_corner('Chinese', 'CN')
cornerTable.append_corner('Fudan', 'CN')
cornerTable.append_corner('English', 'EN')
cornerTable.append_corner('Cipango', 'JP')
cornerTable.append_corner('Korean', 'KR')
cornerTable.append_corner('Spanish', 'ES')
cornerTable.append_corner('Python', 'PY')


def get_ip():
    try:
        try_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        try_socket.connect(('202.120.224.115', 80))  # fudan.edu.cn
        ip = try_socket.getsockname()[0]
    finally:
        try_socket.close()
    return ip


ABOUT_STRING = ('  CLTalk\n'
                + '\tAn Extensible Command Line Instant Messaging Software\n'
                + '\t@ Chiale Kuan\n\tContact me at 16307130212@fudan.edu.cn')
