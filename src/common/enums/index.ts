export enum UserRole {
    Admin = 'admin',
    Manager = 'manager',
    Employee = 'employee',
    Guest = 'guest',
    SuperAdmin = 'superadmin',
}

export enum PermissionLevel {
    Private = 'private',
    Public = 'public',
    Shared = 'shared'
}

export enum WebsocketEvents {
    Connection = "connection",
    Disconnect = "disconnect",
    NewAdminFile = "new-admin-file",
    AdminFileUpdate = "admin-file-update"
}

export enum AppEvents {
    FileUdate = "file-update",
    FileUpload = "file-upload",
    LogActivity = "log-activity"
}

