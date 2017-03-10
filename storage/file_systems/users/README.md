# /users

__Users are NOT supposed to run jobs from this filesystem because of the low performance__. In fact the emphasis on the `/users` filesystem is reliability over performance: all home directories are backed up with GPFS snapshots and no cleaning policy is applied.

The `$HOME` environment variable points to the personal folder `/users/<username>`: please, keep in mind that you cannot exceed the __10 GB - 100 K files quota__ enforced on `$HOME`. To check your usage, please type the command `quota` on the front end Ela. 
